import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { firstValidationError, rsvpSchema } from "@/lib/validation";

export const runtime = "nodejs";

type RateEntry = { count: number; resetAt: number };
const rateLimitStore = new Map<string, RateEntry>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return current.count > RATE_LIMIT;
}

function createSubmissionHash(
  fullName: string,
  attendanceStatus: string,
  totalGuests: number,
  companionNames: string,
) {
  const tenMinuteBucket = Math.floor(Date.now() / (10 * 60 * 1000));
  const secret = process.env.RSVP_HASH_SECRET || "agatha-rsvp-deduplication";
  const source = [
    fullName.toLocaleLowerCase("pt-BR"),
    attendanceStatus,
    totalGuests,
    companionNames.toLocaleLowerCase("pt-BR"),
    tenMinuteBucket,
    secret,
  ].join("|");
  return createHash("sha256").update(source).digest("hex");
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 15_000) {
    return NextResponse.json({ message: "Os dados enviados ultrapassam o limite permitido." }, { status: 413 });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Não foi possível ler os dados enviados." }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: firstValidationError(parsed.error) }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot: bots recebem uma resposta neutra, mas nada é armazenado.
  if (data.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const elapsed = Date.now() - data.startedAt;
  if (elapsed < 2_500) {
    return NextResponse.json(
      { message: "A confirmação foi enviada rápido demais. Revise os dados e tente novamente." },
      { status: 400 },
    );
  }

  if (elapsed > 2 * 60 * 60 * 1000) {
    return NextResponse.json(
      { message: "Este formulário ficou aberto por muito tempo. Atualize a página e tente novamente." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { message: "As confirmações ainda não foram conectadas. Tente novamente quando o convite estiver publicado." },
      { status: 503 },
    );
  }

  const attending = data.attendanceStatus === "yes";
  const { error } = await supabase.from("rsvps").insert({
    full_name: data.fullName,
    attendance_status: data.attendanceStatus,
    total_guests: attending ? data.totalGuests : 0,
    adults: attending ? data.adults : 0,
    children: attending ? data.children : 0,
    companion_names: attending && data.companionNames ? data.companionNames : null,
    message: data.message || null,
    user_agent: request.headers.get("user-agent")?.slice(0, 500) || null,
    submission_hash: createSubmissionHash(
      data.fullName,
      data.attendanceStatus,
      attending ? data.totalGuests : 0,
      attending ? data.companionNames : "",
    ),
  });

  if (error?.code === "23505") {
    return NextResponse.json(
      { message: "Esta confirmação já foi recebida há poucos instantes." },
      { status: 409 },
    );
  }

  if (error) {
    console.error("RSVP insert failed", { code: error.code, message: error.message });
    return NextResponse.json(
      { message: "Não foi possível salvar sua resposta agora. Tente novamente em instantes." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

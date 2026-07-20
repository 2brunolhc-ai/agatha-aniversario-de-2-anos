import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAllowedAdmins() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLocaleLowerCase("pt-BR"))
    .filter(Boolean);
}

type ServerSupabase = NonNullable<ReturnType<typeof createServerSupabase>>;

type AdminAuthorization =
  | { response: NextResponse; supabase: null }
  | { response: null; supabase: ServerSupabase };

async function authorizeAdmin(request: NextRequest): Promise<AdminAuthorization> {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";

  if (!token) {
    return {
      response: NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 }),
      supabase: null,
    };
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return {
      response: NextResponse.json({ message: "O Supabase ainda não foi configurado." }, { status: 503 }),
      supabase: null,
    };
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  const email = authData.user?.email?.toLocaleLowerCase("pt-BR");
  const isAdmin = Boolean(email && getAllowedAdmins().includes(email));

  if (authError || !authData.user || !isAdmin) {
    return {
      response: NextResponse.json({ message: "Você não tem permissão para administrar estes dados." }, { status: 403 }),
      supabase: null,
    };
  }

  return { response: null, supabase };
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeAdmin(request);
  if (authorization.response) return authorization.response;

  const { data, error } = await authorization.supabase
    .from("rsvps")
    .select("id, full_name, attendance_status, total_guests, adults, children, companion_names, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin RSVP list failed", { code: error.code, message: error.message });
    return NextResponse.json({ message: "Não foi possível carregar as confirmações." }, { status: 500 });
  }

  const rsvps = (data || []).map((record) => ({
    ...record,
    companion_count: record.attendance_status === "yes" ? Math.max((record.total_guests || 0) - 1, 0) : 0,
  }));

  return NextResponse.json(
    { rsvps },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}

const deleteSchema = z.object({ id: z.string().uuid() });

export async function DELETE(request: NextRequest) {
  const authorization = await authorizeAdmin(request);
  if (authorization.response) return authorization.response;

  const body = await request.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Confirmação inválida." }, { status: 400 });
  }

  const { data, error } = await authorization.supabase
    .from("rsvps")
    .delete()
    .eq("id", parsed.data.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Admin RSVP delete failed", { code: error.code, message: error.message });
    return NextResponse.json({ message: "Não foi possível excluir esta confirmação." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: "Esta confirmação não foi encontrada." }, { status: 404 });
  }

  return NextResponse.json(
    { ok: true, id: data.id },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}

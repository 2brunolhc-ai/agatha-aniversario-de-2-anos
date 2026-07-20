import { z } from "zod";

const cleanText = (value: string) =>
  value
    .replace(/[<>\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const cleanMultiline = (value: string) =>
  value
    .replace(/[<>\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

export const rsvpSchema = z
  .object({
    fullName: z.string().max(100).transform(cleanText).pipe(z.string().min(3, "Informe o nome completo.")),
    attendanceStatus: z.enum(["yes", "no"], {
      message: "Diga se você poderá comparecer.",
    }),
    hasCompanions: z.enum(["yes", "no"]).optional().default("no"),
    companionCount: z.number().int().min(0).max(19),
    hasChildren: z.enum(["yes", "no"]).optional().default("no"),
    children: z.number().int().min(0).max(19),
    totalGuests: z.number().int().min(0).max(20),
    adults: z.number().int().min(0).max(20),
    companionNames: z.string().max(500).optional().default("").transform(cleanMultiline),
    message: z.string().max(1000).transform(cleanMultiline),
    website: z.string().max(200).optional().default(""),
    startedAt: z.number().int().positive(),
  })
  .superRefine((data, context) => {
    if (data.attendanceStatus === "no") {
      if (data.totalGuests !== 0 || data.companionCount !== 0 || data.children !== 0) {
        context.addIssue({ code: "custom", path: ["totalGuests"], message: "Quem não comparecer deve ter total igual a zero." });
      }
      return;
    }

    const expectedCompanions = data.hasCompanions === "yes" ? data.companionCount : 0;
    const expectedChildren = data.hasChildren === "yes" ? data.children : 0;
    const expectedTotal = 1 + expectedCompanions;

    if (data.hasCompanions === "yes" && data.companionCount < 1) {
      context.addIssue({ code: "custom", path: ["companionCount"], message: "Informe quantos acompanhantes você vai levar." });
    }

    if (data.hasCompanions === "no" && (data.companionCount !== 0 || data.hasChildren === "yes" || data.children !== 0)) {
      context.addIssue({ code: "custom", path: ["companionCount"], message: "Revise os dados dos acompanhantes." });
    }

    if (data.hasChildren === "yes" && data.children < 1) {
      context.addIssue({ code: "custom", path: ["children"], message: "Informe quantas crianças irão." });
    }

    if (expectedChildren > expectedCompanions) {
      context.addIssue({ code: "custom", path: ["children"], message: "A quantidade de crianças não pode ser maior que a quantidade de acompanhantes." });
    }

    if (data.totalGuests !== expectedTotal) {
      context.addIssue({ code: "custom", path: ["totalGuests"], message: "O total de pessoas está incorreto." });
    }

    if (data.adults + expectedChildren !== data.totalGuests) {
      context.addIssue({ code: "custom", path: ["adults"], message: "A quantidade de adultos e crianças está incorreta." });
    }
  });

export type ValidatedRSVP = z.infer<typeof rsvpSchema>;

export function firstValidationError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Revise os dados informados.";
}

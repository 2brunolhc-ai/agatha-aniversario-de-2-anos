"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Baby, Bird, LoaderCircle, MessageCircle, Send, UserPlus, Users } from "lucide-react";
import type { AttendanceStatus, RSVPFormValues } from "@/types/rsvp";
import { RSVPConfirmation } from "@/components/RSVPConfirmation";
import { SectionHeading } from "@/components/SectionHeading";

const initialValues: RSVPFormValues = {
  fullName: "",
  attendanceStatus: "",
  hasCompanions: "",
  companionCount: 1,
  hasChildren: "",
  children: 1,
  companionNames: "",
  message: "",
  website: "",
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export function RSVPForm() {
  const [values, setValues] = useState<RSVPFormValues>(initialValues);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");
  const [confirmedStatus, setConfirmedStatus] = useState<AttendanceStatus>("yes");
  const startedAt = useRef(0);
  const submitting = submitState === "submitting";
  const attending = values.attendanceStatus === "yes";
  const bringingCompanions = attending && values.hasCompanions === "yes";
  const bringingChildren = bringingCompanions && values.hasChildren === "yes";
  const companionCount = bringingCompanions ? values.companionCount : 0;
  const children = bringingChildren ? values.children : 0;
  const totalGuests = attending ? 1 + companionCount : 0;
  const adults = attending ? totalGuests - children : 0;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function update<K extends keyof RSVPFormValues>(key: K, value: RSVPFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (submitState === "error") {
      setSubmitState("idle");
      setFeedback("");
    }
  }

  function chooseAttendance(status: AttendanceStatus) {
    setValues((current) => ({
      ...current,
      attendanceStatus: status,
      ...(status === "no"
        ? { hasCompanions: "", companionCount: 1, hasChildren: "", children: 1, companionNames: "" }
        : {}),
    }));
  }

  function chooseCompanions(choice: "yes" | "no") {
    setValues((current) => ({
      ...current,
      hasCompanions: choice,
      ...(choice === "no" ? { companionCount: 1, hasChildren: "", children: 1, companionNames: "" } : {}),
    }));
  }

  function chooseChildren(choice: "yes" | "no") {
    setValues((current) => ({ ...current, hasChildren: choice, ...(choice === "no" ? { children: 1 } : {}) }));
  }

  function validate() {
    if (values.fullName.trim().length < 3) return "Informe seu nome completo.";
    if (!values.attendanceStatus) return "Diga se você poderá comparecer.";
    if (!attending) return "";
    if (!values.hasCompanions) return "Diga se você vai levar acompanhante.";
    if (bringingCompanions && companionCount < 1) return "Informe quantos acompanhantes você vai levar.";
    if (bringingCompanions && !values.hasChildren) return "Diga se há crianças entre os acompanhantes.";
    if (bringingChildren && children < 1) return "Informe quantas crianças irão.";
    if (children > companionCount) return "A quantidade de crianças não pode ser maior que a quantidade de acompanhantes.";
    if (totalGuests > 20) return "O limite por confirmação é de 20 pessoas.";
    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const errorMessage = validate();
    if (errorMessage) {
      setSubmitState("error");
      setFeedback(errorMessage);
      return;
    }

    setSubmitState("submitting");
    setFeedback("Enviando sua resposta com carinho...");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName,
          attendanceStatus: values.attendanceStatus,
          hasCompanions: bringingCompanions ? "yes" : "no",
          companionCount,
          hasChildren: bringingChildren ? "yes" : "no",
          totalGuests,
          adults,
          children,
          companionNames: bringingCompanions ? values.companionNames : "",
          message: values.message,
          website: values.website,
          startedAt: startedAt.current,
        }),
      });

      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Não foi possível enviar sua confirmação.");

      setConfirmedStatus(values.attendanceStatus as AttendanceStatus);
      setSubmitState("success");
      setFeedback("");
    } catch (error) {
      setSubmitState("error");
      setFeedback(error instanceof Error ? error.message : "Ocorreu um erro. Tente novamente em instantes.");
    }
  }

  function returnToInvitation() {
    setValues(initialValues);
    setSubmitState("idle");
    setFeedback("");
    startedAt.current = Date.now();
    window.setTimeout(() => document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  return (
    <section id="confirmacao" className="rsvp-section section-shell" aria-labelledby="rsvp-title">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          id="rsvp-title"
          eyebrow="Sua resposta é importante"
          title="Você vai comemorar com a gente?"
          description="Confirme sua presença para prepararmos tudo com muito carinho. O convite já conta você como uma pessoa."
        />
        <div className="mt-12">
          {submitState === "success" ? (
            <RSVPConfirmation status={confirmedStatus} onBack={returnToInvitation} />
          ) : (
            <form onSubmit={handleSubmit} className="rsvp-card" noValidate>
              <label className="field">
                <span>Nome completo <em>*</em></span>
                <input
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  maxLength={100}
                  required
                  value={values.fullName}
                  onChange={(event) => update("fullName", event.target.value)}
                  placeholder="Como podemos chamar você?"
                />
              </label>

              <fieldset className="mt-7">
                <legend>Você poderá comparecer? <em>*</em></legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className={`attendance-option ${values.attendanceStatus === "yes" ? "attendance-selected" : ""}`}>
                    <input type="radio" name="attendanceStatus" value="yes" checked={values.attendanceStatus === "yes"} onChange={() => chooseAttendance("yes")} />
                    <span className="grid size-10 place-items-center rounded-full bg-leaf/20 text-leaf-deep"><Bird size={21} aria-hidden="true" /></span>
                    <span><strong>Sim, estarei presente</strong><small>Vai ser uma alegria ter você conosco!</small></span>
                  </label>
                  <label className={`attendance-option ${values.attendanceStatus === "no" ? "attendance-selected" : ""}`}>
                    <input type="radio" name="attendanceStatus" value="no" checked={values.attendanceStatus === "no"} onChange={() => chooseAttendance("no")} />
                    <span className="grid size-10 place-items-center rounded-full bg-lilac-soft text-lilac-deep"><MessageCircle size={20} aria-hidden="true" /></span>
                    <span><strong>Infelizmente não poderei ir</strong><small>Agradecemos por nos avisar.</small></span>
                  </label>
                </div>
              </fieldset>

              {attending ? (
                <div className="mt-7 animate-reveal">
                  <div className="mb-3 inline-flex items-center gap-2 font-extrabold text-plum"><Users size={18} aria-hidden="true" /> Você levará alguém com você?</div>
                  <fieldset>
                    <legend className="sr-only">Vai levar acompanhante?</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className={`attendance-option ${values.hasCompanions === "no" ? "attendance-selected" : ""}`}>
                        <input type="radio" name="hasCompanions" value="no" checked={values.hasCompanions === "no"} onChange={() => chooseCompanions("no")} />
                        <span className="grid size-10 place-items-center rounded-full bg-lilac-soft text-lilac-deep"><Users size={20} aria-hidden="true" /></span>
                        <span><strong>Não, vou sozinho(a)</strong><small>Você será contado(a) como 1 pessoa.</small></span>
                      </label>
                      <label className={`attendance-option ${values.hasCompanions === "yes" ? "attendance-selected" : ""}`}>
                        <input type="radio" name="hasCompanions" value="yes" checked={values.hasCompanions === "yes"} onChange={() => chooseCompanions("yes")} />
                        <span className="grid size-10 place-items-center rounded-full bg-pink-soft text-pink-deep"><UserPlus size={20} aria-hidden="true" /></span>
                        <span><strong>Sim, vou levar acompanhante(s)</strong><small>Informe abaixo quantas pessoas irão com você.</small></span>
                      </label>
                    </div>
                  </fieldset>

                  {bringingCompanions ? (
                    <div className="mt-5 animate-reveal">
                      <label className="field">
                        <span>Quantos acompanhantes você vai levar? <em>*</em></span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={19}
                          value={values.companionCount}
                          onChange={(event) => update("companionCount", Math.min(19, Math.max(1, Number(event.target.value) || 1)))}
                        />
                        <small>Não inclua você nessa quantidade.</small>
                      </label>

                      <fieldset className="mt-5">
                        <legend>Entre os acompanhantes há alguma criança? <em>*</em></legend>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <label className={`attendance-option compact-option ${values.hasChildren === "no" ? "attendance-selected" : ""}`}>
                            <input type="radio" name="hasChildren" value="no" checked={values.hasChildren === "no"} onChange={() => chooseChildren("no")} />
                            <span><strong>Não</strong><small>Todos os acompanhantes são adultos.</small></span>
                          </label>
                          <label className={`attendance-option compact-option ${values.hasChildren === "yes" ? "attendance-selected" : ""}`}>
                            <input type="radio" name="hasChildren" value="yes" checked={values.hasChildren === "yes"} onChange={() => chooseChildren("yes")} />
                            <span className="grid size-10 place-items-center rounded-full bg-pink-soft text-pink-deep"><Baby size={20} aria-hidden="true" /></span>
                            <span><strong>Sim</strong><small>Há criança(s) entre os acompanhantes.</small></span>
                          </label>
                        </div>
                      </fieldset>

                      {bringingChildren ? (
                        <label className="field mt-5 animate-reveal">
                          <span>Quantas crianças irão? <em>*</em></span>
                          <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={companionCount}
                            value={values.children}
                            onChange={(event) => update("children", Math.max(1, Number(event.target.value) || 1))}
                            aria-describedby="children-help"
                          />
                          <small id="children-help">As crianças já fazem parte dos acompanhantes e não serão somadas novamente.</small>
                        </label>
                      ) : null}

                      <label className="field mt-5">
                        <span>Nomes dos acompanhantes <small className="font-medium text-plum/55">(opcional)</small></span>
                        <textarea
                          name="companionNames"
                          rows={3}
                          maxLength={500}
                          value={values.companionNames}
                          onChange={(event) => update("companionNames", event.target.value)}
                          placeholder="Se desejar, escreva os nomes separados por vírgula"
                        />
                      </label>
                    </div>
                  ) : null}

                  {values.hasCompanions ? (
                    <p className="mt-5 rounded-2xl bg-lilac-soft/55 px-4 py-3 text-center font-bold text-plum" aria-live="polite">
                      Total confirmado: {totalGuests} {totalGuests === 1 ? "pessoa" : "pessoas"}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <label className="field mt-5">
                <span>Alguma observação ou recado para a Ágatha?</span>
                <textarea
                  name="message"
                  rows={4}
                  maxLength={1000}
                  value={values.message}
                  onChange={(event) => update("message", event.target.value)}
                  placeholder="Deixe aqui uma mensagem carinhosa..."
                />
              </label>

              <label className="honeypot" aria-hidden="true">
                Não preencha este campo
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} />
              </label>

              <div className="mt-7 flex flex-col items-center gap-4">
                <button type="submit" className="button-primary focus-ring w-full sm:w-auto" disabled={submitting}>
                  {submitting ? (
                    <><LoaderCircle className="animate-spin" size={19} aria-hidden="true" /> Enviando...</>
                  ) : values.attendanceStatus === "no" ? (
                    <>Enviar resposta <Send size={18} aria-hidden="true" /></>
                  ) : (
                    <>Confirmar presença <Send size={18} aria-hidden="true" /></>
                  )}
                </button>
                <div className={`min-h-6 text-center text-sm font-semibold ${submitState === "error" ? "text-error" : "text-plum/65"}`} aria-live="polite" role={submitState === "error" ? "alert" : "status"}>
                  {feedback}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

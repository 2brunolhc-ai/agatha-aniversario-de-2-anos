"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { celebrationEndsAt, celebrationStartsAt, eventConfig } from "@/config/event";

type TimeLeft = {
  days: number;
  totalHours: number;
  minutes: number;
  seconds: number;
  state: "before" | "today" | "after";
};

const millisecondsPerDay = 86_400_000;

function getInclusiveCalendarDays(now: Date): number {
  const todayParts = new Intl.DateTimeFormat("en-US", {
    timeZone: eventConfig.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now).reduce<Record<string, string>>((values, part) => {
    values[part.type] = part.value;
    return values;
  }, {});

  const [eventYear, eventMonth, eventDay] = eventConfig.celebrationDate.split("-").map(Number);
  const todayAtUtc = Date.UTC(Number(todayParts.year), Number(todayParts.month) - 1, Number(todayParts.day));
  const eventAtUtc = Date.UTC(eventYear, eventMonth - 1, eventDay);

  return Math.floor((eventAtUtc - todayAtUtc) / millisecondsPerDay) + 1;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const nowTimestamp = now.getTime();
  const start = new Date(celebrationStartsAt).getTime();
  const end = new Date(celebrationEndsAt).getTime();

  if (nowTimestamp >= end) return { days: 0, totalHours: 0, minutes: 0, seconds: 0, state: "after" };
  if (nowTimestamp >= start) return { days: 0, totalHours: 0, minutes: 0, seconds: 0, state: "today" };

  const distance = start - nowTimestamp;
  return {
    days: getInclusiveCalendarDays(now),
    totalHours: Math.ceil(distance / 3_600_000),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    state: "before",
  };
}

const units = [
  ["days", "Dias no calendário"],
  ["totalHours", "Horas até a festa"],
  ["minutes", "Minutos"],
  ["seconds", "Segundos"],
] as const;

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(calculateTimeLeft());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const accessibleText = useMemo(() => {
    if (!timeLeft) return "Carregando contagem regressiva.";
    if (timeLeft.state === "today") return "Hoje é o grande dia! Estamos esperando por você!";
    if (timeLeft.state === "after") return "Esse dia ficou guardado para sempre em nossos corações.";
    return `Contando hoje e o dia da festa, são ${timeLeft.days} dias no calendário. Restam ${timeLeft.totalHours} horas, arredondadas para cima.`;
  }, [timeLeft]);

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24" aria-labelledby="countdown-title">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lilac-deep/25 to-transparent" />
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Sparkles className="mx-auto text-pink-deep" size={27} strokeWidth={1.5} aria-hidden="true" />
        <h2 id="countdown-title" className="font-display mt-3 text-4xl text-plum sm:text-5xl">
          Falta pouco para o jardim da Ágatha florescer!
        </h2>
        <p className="mt-4 text-plum/65">Domingo, 26 de julho de 2026, às 12:00 · horário de Brasília</p>
        <p className="sr-only" aria-live="polite" aria-atomic="true">{accessibleText}</p>

        {!timeLeft ? (
          <div className="mt-10 h-28 animate-pulse rounded-[2rem] bg-lilac-soft/60" aria-hidden="true" />
        ) : timeLeft.state === "before" ? (
          <>
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
              {units.map(([key, label], index) => (
                <div key={key} className={`countdown-card ${index % 2 === 0 ? "countdown-lilac" : "countdown-pink"}`}>
                  <span className="font-display block text-5xl tabular-nums text-plum sm:text-6xl">
                    {String(timeLeft[key]).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block text-xs font-extrabold uppercase tracking-[.16em] text-plum/65">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-4 max-w-xl text-xs leading-5 text-plum/55">
              Os dias incluem hoje e o dia da festa. As horas são arredondadas para cima.
            </p>
          </>
        ) : (
          <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-white bg-gradient-to-br from-lilac-soft to-pink-soft p-8 shadow-soft sm:p-12">
            <p className="font-display text-3xl leading-tight text-plum sm:text-4xl">{accessibleText}</p>
          </div>
        )}
      </div>
    </section>
  );
}

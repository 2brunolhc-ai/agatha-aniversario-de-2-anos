import { Bird, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/60 bg-lilac-soft px-5 py-10 text-center text-plum">
      <Bird className="mx-auto mb-3 text-lilac-deep" size={26} strokeWidth={1.4} aria-hidden="true" />
      <p className="inline-flex flex-wrap items-center justify-center gap-2 font-semibold">
        Feito com <Heart size={14} fill="currentColor" className="text-pink-deep" aria-label="amor" /> para os 2 aninhos da Ágatha.
      </p>
      <p className="mt-2 text-sm uppercase tracking-[.17em] text-plum/60">26 de julho de 2026</p>
    </footer>
  );
}

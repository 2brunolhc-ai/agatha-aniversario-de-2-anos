import { Bird, Check, Flower2, Heart } from "lucide-react";
import type { AttendanceStatus } from "@/types/rsvp";

type RSVPConfirmationProps = {
  status: AttendanceStatus;
  onBack: () => void;
};

export function RSVPConfirmation({ status, onBack }: RSVPConfirmationProps) {
  const attending = status === "yes";

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-white/90 bg-white/85 px-6 py-12 text-center shadow-card backdrop-blur sm:px-12 sm:py-16">
      <Flower2 className="flower-sway absolute -left-3 -top-2 text-pink/65" size={86} strokeWidth={1} aria-hidden="true" />
      <Bird className="bird-float absolute right-5 top-6 text-lilac-deep/55" size={46} strokeWidth={1.25} aria-hidden="true" />
      <Heart className="heart-float absolute bottom-10 right-10 text-pink-deep/35" size={22} fill="currentColor" strokeWidth={0} aria-hidden="true" />

      <span className={`mx-auto grid size-20 place-items-center rounded-full ${attending ? "bg-leaf/25 text-leaf-deep" : "bg-lilac-soft text-lilac-deep"}`}>
        {attending ? <Check size={38} strokeWidth={2} aria-hidden="true" /> : <Heart size={34} strokeWidth={1.5} aria-hidden="true" />}
      </span>
      <h3 className="font-display mt-6 text-4xl leading-tight text-plum sm:text-5xl">
        {attending ? "Presença confirmada!" : "Obrigado por nos avisar"}
      </h3>
      <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-plum/75">
        {attending
          ? "Ficamos muito felizes em saber que você estará conosco nesse dia especial."
          : "Sentiremos sua falta, mas agradecemos por fazer parte da nossa história."}
      </p>
      <button type="button" onClick={onBack} className="button-secondary focus-ring mt-8">
        Voltar para o convite
      </button>
    </div>
  );
}

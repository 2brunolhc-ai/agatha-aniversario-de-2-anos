import { BookOpen, Footprints, Gift, Heart, Palette, Puzzle, Shirt } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const suggestions = [
  { title: "Livros infantis", detail: "Para 2 anos ou mais", icon: BookOpen, tone: "gift-sky" },
  { title: "Brinquedos educativos", detail: "Indicados para 2+", icon: Puzzle, tone: "gift-leaf" },
  { title: "Massinhas e pintura", detail: "Para criar e brincar", icon: Palette, tone: "gift-pink" },
  { title: "Bichinhos de pelúcia", detail: "Pequenos e macios", icon: Heart, tone: "gift-lilac" },
] as const;

export function GiftSuggestions() {
  return (
    <section id="presentes" className="garden-section section-shell" aria-labelledby="gifts-title">
      <SectionHeading
        id="gifts-title"
        eyebrow="Para quem pediu uma ajudinha"
        title="Presentes e tamanhos da Ágatha"
        description="Sua presença já é o nosso maior presente! Mas, caso queira levar um mimo, aqui estão os tamanhos dela e algumas ideias carinhosas."
      />

      <div className="mx-auto mt-12 max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="flex items-center gap-4 rounded-[1.65rem] border border-white bg-gradient-to-br from-white to-pink-soft p-5 text-left shadow-soft sm:p-6">
            <span className="gift-icon size-14 shrink-0 bg-white text-pink-deep"><Shirt aria-hidden="true" /></span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-plum/55">Roupas</p>
              <h3 className="font-display mt-1 text-2xl text-plum">Tamanho 2 anos</h3>
              <p className="mt-1 text-sm text-plum/60">Vestidos, conjuntos, pijamas e roupinhas para brincar.</p>
            </div>
          </article>

          <article className="flex items-center gap-4 rounded-[1.65rem] border border-white bg-gradient-to-br from-white to-lilac-soft p-5 text-left shadow-soft sm:p-6">
            <span className="gift-icon size-14 shrink-0 bg-white text-lilac-deep"><Footprints aria-hidden="true" /></span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-plum/55">Calçados</p>
              <h3 className="font-display mt-1 text-2xl text-plum">Número 21</h3>
              <p className="mt-1 text-sm text-plum/60">Tênis, sapatinhos e sandálias confortáveis.</p>
            </div>
          </article>
        </div>

        <p className="mt-10 text-center text-xs font-extrabold uppercase tracking-[.18em] text-lilac-deep">Outras ideias de presentes</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map(({ title, detail, icon: Icon, tone }) => (
            <article key={title} className={`gift-card ${tone}`}>
              <span className="gift-icon"><Icon aria-hidden="true" /></span>
              <div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-5 flex max-w-4xl items-start gap-3 rounded-[1.4rem] border border-white bg-white/80 p-5 text-plum shadow-soft">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-pink-soft text-pink-deep">
            <Gift size={19} aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-xl leading-7">Mas não se preocupe: a Ágatha fica feliz com qualquer presente recebido com carinho.</p>
            <p className="mt-1 text-sm leading-6 text-plum/60">Estas são apenas ideias, nunca uma obrigação.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { Bird, Heart } from "lucide-react";
import { familyPhoto } from "@/config/photos";

export function FamilySection() {
  return (
    <section className="section-shell garden-section" aria-labelledby="family-title">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
        <div className="family-photo-wrap">
          <Image
            src={familyPhoto.src}
            alt={familyPhoto.alt}
            fill
            sizes="(max-width: 1024px) 92vw, 52vw"
            className="object-cover"
            style={{ objectPosition: familyPhoto.objectPosition }}
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-plum/25 to-transparent" />
          <span className="absolute -bottom-4 right-5 grid size-16 place-items-center rounded-full border-4 border-white bg-pink text-white shadow-soft">
            <Heart fill="currentColor" strokeWidth={0} aria-hidden="true" />
          </span>
        </div>
        <div className="text-center lg:text-left">
          <Bird className="mx-auto text-lilac-deep lg:mx-0" size={38} strokeWidth={1.35} aria-hidden="true" />
          <h2 id="family-title" className="font-display mt-5 text-balance text-4xl leading-[1.08] text-plum sm:text-5xl">
            A história da Ágatha fica mais bonita com você
          </h2>
          <p className="mt-6 text-pretty text-lg leading-8 text-plum/75">
            Cada sorriso, abraço e momento compartilhado torna a história da Ágatha ainda mais especial. Esperamos você para celebrar conosco!
          </p>
          <p className="font-display mt-8 text-2xl leading-snug text-lilac-deep sm:text-3xl">
            Com carinho,<br />Mamãe, Papai e Ágatha
          </p>
        </div>
      </div>
    </section>
  );
}

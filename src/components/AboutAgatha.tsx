import Image from "next/image";
import { Heart } from "lucide-react";
import { timelinePhotos } from "@/config/photos";
import { SectionHeading } from "@/components/SectionHeading";

export function AboutAgatha() {
  return (
    <section id="historia" className="garden-section section-shell" aria-labelledby="about-title">
      <SectionHeading
        id="about-title"
        eyebrow="A nossa história"
        title="Dois aninhos de amor, alegria e muitos sorrisos"
        description="Parece que foi ontem que a Ágatha chegou para transformar nossas vidas. Agora, nossa pequena completa 2 aninhos, enchendo nossos dias de alegria, descobertas, carinho e muitos sorrisos. Queremos celebrar esse momento especial ao lado das pessoas que fazem parte da nossa história."
      />
      <div className="relative mx-auto mt-14 max-w-6xl">
        <div className="absolute left-[8%] right-[8%] top-[38%] hidden border-t border-dashed border-lilac-deep/35 lg:block" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-6 lg:grid-cols-5">
          {timelinePhotos.map((photo, index) => (
            <article
              key={photo.label}
              className={`timeline-card group ${index === timelinePhotos.length - 1 ? "col-span-2 mx-auto w-[calc(50%-0.375rem)] min-w-[148px] lg:col-span-1 lg:w-auto" : ""}`}
            >
              <div className="timeline-photo">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 18vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.035]"
                  style={{ objectPosition: photo.objectPosition }}
                />
              </div>
              <div className="relative pt-5 text-center">
                <span className="mx-auto -mt-8 mb-3 grid size-8 place-items-center rounded-full border-4 border-[#fffafc] bg-pink text-white shadow-soft">
                  <Heart size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl leading-tight text-plum">{photo.label}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

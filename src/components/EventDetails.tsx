import { CalendarDays, Clock3, ExternalLink, MapPin, Navigation } from "lucide-react";
import { eventConfig } from "@/config/event";
import { SectionHeading } from "@/components/SectionHeading";

export function EventDetails() {
  return (
    <section id="detalhes" className="section-shell bg-white" aria-labelledby="details-title">
      <SectionHeading
        id="details-title"
        eyebrow="Guarde este dia"
        title="Nosso encontro está marcado"
        description="A confirmação de presença é para a comemoração de domingo. Anote a data, o horário e a localização."
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-[.8fr_.7fr_1.5fr]">
        <article className="detail-card detail-card-lilac">
          <span className="detail-icon"><CalendarDays aria-hidden="true" /></span>
          <div>
            <p className="detail-label">Data da festa</p>
            <h3>Domingo, 26 de julho de 2026</h3>
            <p>A comemoração dos 2 aninhos da Ágatha.</p>
          </div>
        </article>

        <article className="detail-card detail-card-pink">
          <span className="detail-icon"><Clock3 aria-hidden="true" /></span>
          <div>
            <p className="detail-label">Horário</p>
            <h3>{eventConfig.celebrationTime}</h3>
            <p>Horário de Brasília.</p>
          </div>
        </article>

        <article id="localizacao" className="detail-card detail-card-leaf scroll-mt-6 md:col-span-2 lg:col-span-1">
          <span className="detail-icon"><MapPin aria-hidden="true" /></span>
          <div className="min-w-0">
            <p className="detail-label">Localização</p>
            <address className="mt-3 not-italic leading-7 text-plum/75">
              {eventConfig.addressLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
            <p className="mt-3 break-words text-xs font-semibold text-plum/55">Coordenadas: {eventConfig.coordinates.formatted}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                className="button-secondary focus-ring w-fit"
                href={eventConfig.mapsUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir localização correta no Google Maps em uma nova aba"
              >
                Google Maps <ExternalLink size={17} aria-hidden="true" />
              </a>
              <a
                className="button-secondary focus-ring w-fit"
                href={eventConfig.wazeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir localização correta no Waze em uma nova aba"
              >
                Waze <Navigation size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      </div>

      <div className="mx-auto mt-5 max-w-6xl overflow-hidden rounded-[1.4rem] border border-lilac-deep/15 bg-lilac-soft/35 shadow-soft">
        <iframe
          title="Mapa da festa da Ágatha"
          src={eventConfig.mapEmbedUrl}
          className="h-[320px] w-full border-0 sm:h-[400px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="mx-auto mt-5 max-w-6xl rounded-[1.4rem] border border-lilac-deep/15 bg-lilac-soft/35 px-5 py-4 text-center text-sm leading-6 text-plum/70">
        Ágatha completa 2 anos em 15 de julho de 2026. A confirmação acima é exclusivamente para a festa de 26 de julho, às 12:00.
      </div>
    </section>
  );
}

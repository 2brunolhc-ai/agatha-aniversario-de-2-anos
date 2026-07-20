import { ArrowDown, MapPin, Navigation } from "lucide-react";

export function LocationShortcut() {
  return (
    <section
      className="location-shortcut-shell"
      aria-label="Atalho para a localização da festa"
    >
      <a href="#localizacao" className="location-shortcut focus-ring">
        <span className="location-shortcut-icon" aria-hidden="true">
          <MapPin size={27} strokeWidth={2} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-xs font-extrabold uppercase tracking-[.16em] text-lilac-deep">
            Localização da festa
          </span>
          <span className="mt-1 block font-display text-xl font-semibold leading-tight text-plum sm:text-2xl">
            Veja o endereço e abra a rota
          </span>
          <span className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-plum/65">
            <Navigation size={15} aria-hidden="true" />
            Toque aqui para ir até a localização
          </span>
        </span>

        <span className="location-shortcut-arrow" aria-hidden="true">
          <ArrowDown size={21} />
        </span>
      </a>
    </section>
  );
}

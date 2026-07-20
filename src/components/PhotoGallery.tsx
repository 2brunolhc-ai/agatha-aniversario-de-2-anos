"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { galleryPhotos } from "@/config/photos";
import { SectionHeading } from "@/components/SectionHeading";

export function PhotoGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const previous = useCallback(() => {
    setActiveIndex((current) => current === null ? null : (current - 1 + galleryPhotos.length) % galleryPhotos.length);
  }, []);
  const next = useCallback(() => {
    setActiveIndex((current) => current === null ? null : (current + 1) % galleryPhotos.length);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();

      if (event.key === "Tab" && dialogRef.current) {
        const buttons = Array.from(dialogRef.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
        if (!buttons.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, next, previous]);

  return (
    <section id="galeria" className="section-shell bg-white" aria-labelledby="gallery-title">
      <SectionHeading
        id="gallery-title"
        eyebrow="Memórias preciosas"
        title="Um álbum cheio de amor"
        description="Dos primeiros sorrisos às aventuras de agora — pequenos instantes que fizeram nossos dias florescerem."
      />
      <div className="gallery-grid mx-auto mt-12 max-w-6xl">
        {galleryPhotos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`gallery-item relative group focus-ring ${photo.featured ? "gallery-featured" : ""}`}
            aria-label={`Abrir foto ${index + 1} de ${galleryPhotos.length}: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={photo.featured ? "(max-width: 640px) 94vw, (max-width: 1024px) 62vw, 40vw" : "(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 20vw"}
              className="object-cover transition duration-700 group-hover:scale-[1.035]"
              style={{ objectPosition: photo.objectPosition }}
            />
            <span className="gallery-overlay" aria-hidden="true">
              <Expand size={20} />
            </span>
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${activeIndex + 1} de ${galleryPhotos.length}`}
          className="fixed inset-0 z-50 grid place-items-center bg-plum/90 p-3 backdrop-blur-md sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button ref={closeButtonRef} type="button" onClick={close} className="lightbox-button absolute right-4 top-4 focus-ring sm:right-8 sm:top-8" aria-label="Fechar galeria">
            <X aria-hidden="true" />
          </button>
          <button type="button" onClick={previous} className="lightbox-button absolute left-3 top-1/2 -translate-y-1/2 focus-ring sm:left-8" aria-label="Foto anterior">
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="relative h-[78svh] w-[calc(100vw-5.5rem)] max-w-5xl overflow-hidden rounded-[1.5rem] sm:w-[calc(100vw-13rem)]">
            <Image
              src={galleryPhotos[activeIndex].src}
              alt={galleryPhotos[activeIndex].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          <button type="button" onClick={next} className="lightbox-button absolute right-3 top-1/2 -translate-y-1/2 focus-ring sm:right-8" aria-label="Próxima foto">
            <ChevronRight aria-hidden="true" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
            {activeIndex + 1} / {galleryPhotos.length}
          </p>
        </div>
      ) : null}
    </section>
  );
}

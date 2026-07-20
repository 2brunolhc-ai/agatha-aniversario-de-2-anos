import Image from "next/image";
import { ArrowDown, Bird, CalendarDays, Gift, Heart } from "lucide-react";
import { invitationReference } from "@/config/photos";
import { DecorativeGarden } from "@/components/DecorativeGarden";
import { HeroPhotoCarousel } from "@/components/HeroPhotoCarousel";

export function HeroSection() {
  return (
    <header id="inicio" className="hero-section relative isolate overflow-hidden">
      <DecorativeGarden />
      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#inicio" className="group inline-flex items-center gap-2 rounded-full focus-ring">
          <span className="grid size-10 place-items-center rounded-full border border-white/70 bg-white/75 text-lilac-deep shadow-soft backdrop-blur">
            <Bird size={20} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-semibold text-plum sm:text-2xl">Ágatha</span>
        </a>
        <a href="#confirmacao" className="nav-cta focus-ring">
          Confirmar presença
        </a>
      </nav>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-80px)] w-full max-w-7xl items-center gap-10 px-5 pb-16 pt-7 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:gap-12 lg:px-12 lg:pb-24 lg:pt-10">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <div className="eyebrow justify-center lg:justify-start">
            <Heart size={15} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            <span>Convite especial · 2 aninhos</span>
          </div>
          <h1 className="font-display mt-5 text-balance text-[clamp(4rem,13vw,7.8rem)] font-medium leading-[.88] tracking-[-0.05em] text-plum">
            Ágatha
            <span className="mt-5 block font-sans text-[.36em] font-bold uppercase leading-none tracking-[.16em] text-lilac-deep">
              faz 2!
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-8 text-plum/80 sm:text-xl sm:leading-9 lg:mx-0">
            Nosso passarinho está crescendo e queremos celebrar esse momento com você.
          </p>
          <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/70 px-5 py-3 text-sm font-bold uppercase tracking-[.13em] text-plum shadow-soft backdrop-blur sm:text-base">
            <CalendarDays size={19} className="text-lilac-deep" aria-hidden="true" />
            <span>Domingo, 26 de julho de 2026, às 12:00</span>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <a href="#confirmacao" className="button-primary focus-ring">
              Confirmar minha presença
              <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a href="#presentes" className="button-secondary focus-ring">
              <Gift size={18} aria-hidden="true" />
              Ver presentes e tamanhos
            </a>
            <a href="#historia" className="text-link focus-ring">
              Conhecer nossa história
            </a>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="hero-photo-stage relative">
            <div className="absolute -right-8 top-10 hidden h-[76%] w-[48%] rotate-6 overflow-hidden rounded-[48%] border-[8px] border-white/60 opacity-30 shadow-soft sm:block">
              <Image
                src={invitationReference.src}
                alt=""
                fill
                sizes="220px"
                className="object-cover object-[50%_62%]"
                aria-hidden="true"
              />
            </div>
            <div className="hero-photo-halo" />
            <div className="hero-photo-frame">
              <HeroPhotoCarousel />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-plum/25 to-transparent" />
            </div>
            <div className="absolute -bottom-3 -left-4 rounded-[1.8rem] border border-white/80 bg-white/85 px-4 py-3 shadow-soft backdrop-blur sm:-left-10 sm:px-5">
              <span className="block text-xs font-extrabold uppercase tracking-[.16em] text-lilac-deep">Nosso jardim</span>
              <span className="font-display text-xl text-plum sm:text-2xl">floresceu com ela</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

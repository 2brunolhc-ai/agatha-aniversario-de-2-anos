"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroPhotos } from "@/config/photos";

const slideDuration = 4_500;

export function HeroPhotoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (heroPhotos.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroPhotos.length);
    }, slideDuration);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {heroPhotos.map((photo, index) => {
        const isActive = index === activeIndex;

        return (
          <Image
            key={photo.src}
            src={photo.src}
            alt={isActive ? photo.alt : ""}
            fill
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 430px, 38vw"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100" : "opacity-0"}`}
            style={{ objectPosition: photo.objectPosition }}
            aria-hidden={!isActive}
          />
        );
      })}

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-plum/20 px-2.5 py-1.5 backdrop-blur" aria-hidden="true">
        {heroPhotos.map((photo, index) => (
          <span
            key={photo.src}
            className={`block h-1.5 rounded-full bg-white transition-[width,opacity] duration-500 ${index === activeIndex ? "w-5 opacity-100" : "w-1.5 opacity-60"}`}
          />
        ))}
      </div>
    </div>
  );
}

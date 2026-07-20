import { Bird, Cloud, Flower2, Heart, House } from "lucide-react";

export function DecorativeGarden() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Cloud className="cloud-drift absolute left-[4%] top-[13%] text-white/80" size={92} strokeWidth={1} />
      <Cloud className="cloud-drift-delayed absolute right-[8%] top-[7%] text-white/75" size={118} strokeWidth={1} />
      <Bird className="bird-float absolute left-[8%] top-[36%] hidden text-lilac-deep/55 sm:block" size={44} strokeWidth={1.4} />
      <Bird className="bird-float-delayed absolute right-[5%] top-[30%] text-sky/90" size={36} strokeWidth={1.5} />
      <Heart className="heart-float absolute left-[44%] top-[18%] text-pink-deep/45" size={19} fill="currentColor" strokeWidth={0} />
      <Flower2 className="flower-sway absolute bottom-[7%] left-[5%] text-leaf/70" size={62} strokeWidth={1.2} />
      <Flower2 className="flower-sway-delayed absolute bottom-[5%] right-[7%] text-pink-deep/65" size={54} strokeWidth={1.2} />
      <House className="absolute bottom-[5%] left-[17%] hidden text-wood/45 lg:block" size={56} strokeWidth={1.1} />
    </div>
  );
}

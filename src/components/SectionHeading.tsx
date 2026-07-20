import { Flower2 } from "lucide-react";

type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "section-heading mx-auto text-center" : "section-heading"}>
      <div className={align === "center" ? "eyebrow justify-center" : "eyebrow"}>
        <Flower2 aria-hidden="true" size={16} strokeWidth={1.8} />
        <span>{eyebrow}</span>
      </div>
      <h2 id={id} className="font-display mt-4 text-balance text-4xl leading-[1.08] text-plum sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-plum/75 sm:text-lg sm:leading-8">
          {description}
        </p>
      ) : null}
    </div>
  );
}

import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  overline?: string;
  title: ReactNode;
  lede?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  reveal?: boolean;
};

export default function SectionHeading({
  overline,
  title,
  lede,
  align = "left",
  tone = "dark",
  className = "",
  reveal = true,
}: SectionHeadingProps) {
  const isLight = tone === "light";
  const alignment = align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl";

  const content = (
    <>
      {overline && <p className={`overline mb-5 ${isLight ? "text-gold" : ""}`}>{overline}</p>}
      <h2 className={`heading-xl ${isLight ? "text-ivory" : "text-charcoal"}`}>{title}</h2>
      {lede && (
        <p
          className={`mt-6 max-w-2xl lede ${align === "center" ? "mx-auto" : ""} ${
            isLight ? "text-ivory/70" : ""
          }`}
        >
          {lede}
        </p>
      )}
    </>
  );

  if (!reveal) {
    return <div className={`${alignment} ${className}`}>{content}</div>;
  }

  return (
    <Reveal className={`${alignment} ${className}`}>{content}</Reveal>
  );
}

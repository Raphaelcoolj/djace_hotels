"use client";

import { useCallback, useState } from "react";
import SmartImage from "@/components/ui/SmartImage";

type RoomGalleryProps = {
  images: string[];
  alt: string;
};

export default function RoomGallery({ images, alt }: RoomGalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const hasMultiple = count > 1;
  const imagesKey = images.join("|");
  const [prevImagesKey, setPrevImagesKey] = useState(imagesKey);

  if (prevImagesKey !== imagesKey) {
    setPrevImagesKey(imagesKey);
    setIndex(0);
  }

  const go = useCallback(
    (next: number) => setIndex((next + count) % count),
    [count]
  );

  const safeIndex = count === 0 ? 0 : Math.min(index, count - 1);
  const current = images[safeIndex];

  return (
    <div>
      <div className="relative overflow-hidden bg-cream">
        <SmartImage
          key={safeIndex}
          src={current}
          alt={count > 1 ? `${alt} — image ${safeIndex + 1} of ${count}` : alt}
          className="aspect-[4/3] w-full md:aspect-[16/10]"
          imgClassName="animate-fade-in"
          sizes="(max-width: 1024px) 100vw, 62vw"
          priority
          quality={85}
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => go(safeIndex - 1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-ivory/90 text-charcoal transition-colors duration-300 hover:bg-gold hover:text-charcoal"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(safeIndex + 1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-ivory/90 text-charcoal transition-colors duration-300 hover:bg-gold hover:text-charcoal"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <span
              aria-live="polite"
              className="absolute bottom-4 right-4 bg-charcoal/80 px-3 py-1.5 font-body text-[10px] tracking-[0.2em] text-ivory"
            >
              {safeIndex + 1} / {count}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Room images">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === safeIndex}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden border-2 transition-colors duration-300 ${
                i === safeIndex ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <SmartImage src={src} alt="" className="h-full w-full" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

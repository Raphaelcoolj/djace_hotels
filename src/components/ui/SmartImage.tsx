"use client";

import Image from "next/image";
import { useState } from "react";

type SmartImageProps = {
  src?: string | null;
  alt: string;
  /** Sizing classes for the wrapper (e.g. "aspect-[4/3]", "h-full") */
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  fallbackLabel?: string;
};

/**
 * next/image wrapper with graceful fallback and load-in fade.
 * The wrapper owns sizing; the image always renders as `fill`.
 */
export default function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  sizes,
  priority,
  quality,
  fallbackLabel = "Luxury Hotel & Lounge",
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showImage = Boolean(src) && !failed;
  // Tailwind emits `.relative` after `.absolute`, so a hardcoded `relative`
  // would beat a caller's `absolute` and collapse the fill wrapper. Only apply
  // the default position when the caller hasn't specified one.
  const hasOwnPosition = /\b(absolute|fixed|sticky|static|relative)\b/.test(
    className
  );

  return (
    <div
      className={`overflow-hidden bg-cream ${
        hasOwnPosition ? "" : "relative"
      } ${className}`}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`object-cover transition-opacity duration-700 ease-luxe ${
            loaded ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
          role="img"
          aria-label={alt}
        >
          <span className="font-heading text-sm md:text-base uppercase tracking-[0.3em] text-warmgrey/80">
            {fallbackLabel}
          </span>
        </div>
      )}
    </div>
  );
}

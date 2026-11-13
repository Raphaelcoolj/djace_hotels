import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";

type HeroProps = {
  imageUrl: string;
};

export default function Hero({ imageUrl }: HeroProps) {
  return (
    <section className="relative min-h-[92svh] md:min-h-screen flex items-end md:items-center overflow-hidden">
      <SmartImage
        src={imageUrl}
        alt="Luxury Hotel & Lounge exterior"
        className="absolute inset-0 h-full w-full"
        imgClassName="object-center"
        sizes="100vw"
        priority
        quality={85}
      />
      {/* Controlled overlay for readable text */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/40 to-charcoal/25 md:bg-gradient-to-r md:from-charcoal/70 md:via-charcoal/35 md:to-transparent"
      />

      <div className="relative z-10 w-full pb-24 pt-32 md:pb-0 md:pt-0">
        <div className="container">
          <div className="max-w-3xl">
            <p
              className="overline text-gold animate-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              Luxury Hotel &amp; Lounge
            </p>
            <h1
              className="display mt-6 text-ivory animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              Where refined elegance meets timeless comfort
            </h1>
            <p
              className="mt-7 max-w-xl font-body text-base md:text-lg font-light leading-relaxed text-ivory/80 animate-fade-up"
              style={{ animationDelay: "0.45s" }}
            >
              Your exclusive retreat for unforgettable moments.
            </p>
            <div
              className="mt-10 flex flex-col gap-4 sm:flex-row animate-fade-up"
              style={{ animationDelay: "0.6s" }}
            >
              <Link href="/rooms" className="btn btn-gold sm:min-w-[220px]">
                Explore Rooms
              </Link>
              <Link
                href="/#about"
                className="btn btn-outline-light sm:min-w-[220px]"
              >
                Discover the Hotel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-body text-[9px] uppercase tracking-[0.35em] text-ivory/50">
          Scroll
        </span>
        <span className="block h-12 w-px bg-gradient-to-b from-ivory/50 to-transparent" />
      </div>
    </section>
  );
}

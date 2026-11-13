import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

type CtaSectionProps = {
  phone?: string;
};

export default function CtaSection({ phone }: CtaSectionProps) {
  return (
    <section className="section bg-cream">
      <div className="container-narrow text-center">
        <Reveal>
          <p className="overline">Reservations</p>
          <h2 className="heading-xl mx-auto mt-6 max-w-2xl text-charcoal">
            Your stay begins with a single request
          </h2>
          <p className="lede mx-auto mt-6 max-w-xl">
            Select your room and dates — our team will confirm your reservation
            personally and guide you through the next steps.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link href="/rooms" className="btn btn-gold sm:min-w-[220px]">
              Reserve Your Stay
            </Link>
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="link-underline text-charcoal hover:text-gold"
              >
                or call {phone}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/ui/Reveal";

type AboutSectionProps = {
  imageUrl: string;
};

export default function AboutSection({ imageUrl }: AboutSectionProps) {
  return (
    <section id="about" className="section bg-ivory">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-6">
            <SmartImage
              src={imageUrl}
              alt="The hotel at a glance"
              className="aspect-[4/3] w-full lg:aspect-[5/4]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>

          <Reveal delay={1} className="lg:col-span-5 lg:col-start-8">
            <p className="overline">About the hotel</p>
            <h2 className="heading-xl mt-5 text-charcoal">
              A quiet address for effortless stays
            </h2>
            <div className="mt-7 flex flex-col gap-5 font-body text-base font-light leading-relaxed text-warmgrey">
              <p>
                Luxury Hotel &amp; Lounge is an exclusive retreat where refined
                elegance meets timeless comfort — created for guests who value
                privacy, attentive service and beautifully considered spaces.
              </p>
              <p>
                From the moment you arrive, every detail is shaped around one
                purpose: making your stay effortless. Settle into rooms designed
                for rest, explore the hotel at your own pace, and let our team
                take care of the rest.
              </p>
            </div>
            <div className="mt-9 h-px w-16 bg-gold" aria-hidden />
            <p className="mt-6 font-heading text-xl italic text-charcoal">
              &ldquo;Experience unparalleled luxury and breathtaking views.&rdquo;
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

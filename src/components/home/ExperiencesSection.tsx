import connectDB from "@/lib/db";
import Room from "@/models/Room";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import SmartImage from "@/components/ui/SmartImage";

/**
 * Amenities & experiences are aggregated from the actual room data in the
 * database — nothing is invented. The section is hidden when no amenity
 * data exists.
 */
export default async function ExperiencesSection() {
  let amenities: string[] = [];
  let imageSrc: string | null = null;

  try {
    await connectDB();
    const [distinct, sampleRoom] = await Promise.all([
      Room.distinct("amenities", { isAvailable: true }),
      Room.findOne({ isAvailable: true, "images.0": { $exists: true } }).select(
        "images name"
      ),
    ]);
    amenities = Array.from(
      new Set(
        distinct
          .filter((a): a is string => typeof a === "string" && a.trim().length > 0)
          .map((a) => a.trim())
      )
    ).sort((a, b) => a.localeCompare(b));
    imageSrc = sampleRoom?.images?.[0] ?? null;
  } catch {
    return null;
  }

  if (amenities.length === 0) return null;

  return (
    <section id="experiences" className="section bg-cream">
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Editorial image */}
          <Reveal className="lg:col-span-5">
            <SmartImage
              src={imageSrc}
              alt="Interior detail of the hotel"
              className="aspect-[4/5] w-full lg:aspect-[3/4]"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <p className="mt-4 font-body text-xs tracking-wide text-warmgrey">
              Thoughtful details throughout your stay
            </p>
          </Reveal>

          {/* Amenities */}
          <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <SectionHeading
              overline="Experiences"
              title="Everything you need, nothing you don't"
              lede="A selection of the comforts and services available to guests — the details that shape an effortless stay."
            />

            <ul className="mt-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
              {amenities.map((amenity, i) => (
                <li
                  key={amenity}
                  className="group flex items-baseline gap-4 bg-cream px-6 py-5 transition-colors duration-300 hover:bg-ivory"
                >
                  <span className="font-body text-[10px] tracking-widest text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-lg md:text-xl font-normal text-charcoal transition-colors duration-300 group-hover:text-gold">
                    {amenity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

import connectDB from "@/lib/db";
import Feedback from "@/models/Feedback";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

function Stars({ rating }: { rating?: number }) {
  if (!rating) return null;
  const value = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <p className="font-body text-sm tracking-[0.3em] text-gold" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(value)}
      <span className="text-warmgrey/40">{"★".repeat(5 - value)}</span>
    </p>
  );
}

/**
 * Renders genuine guest feedback from the database only.
 * The section is hidden when no feedback exists — nothing is invented.
 */
export default async function TestimonialsSection() {
  let entries: { name: string; message: string; rating?: number }[] = [];

  try {
    await connectDB();
    const docs = await Feedback.find({ message: { $ne: "" } })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("name message rating");
    entries = docs.map((d) => ({
      name: d.name,
      message: d.message,
      rating: d.rating ?? undefined,
    }));
  } catch {
    return null;
  }

  if (entries.length === 0) return null;

  return (
    <section className="section bg-forest">
      <div className="container">
        <SectionHeading
          overline="Guest feedback"
          title="Words from our guests"
          align="center"
          tone="light"
        />

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry, i) => (
            <Reveal
              key={`${entry.name}-${i}`}
              delay={((i % 3) + 1) as 1 | 2 | 3}
              className="flex h-full flex-col border border-ivory/15 bg-forest-deep/40 p-8"
            >
              <span
                aria-hidden
                className="font-heading text-5xl leading-none text-gold/50"
              >
                &ldquo;
              </span>
              <blockquote className="mt-3 flex-1 font-body text-sm md:text-[15px] font-light leading-relaxed text-ivory/85">
                {entry.message}
              </blockquote>
              <footer className="mt-7 border-t border-ivory/10 pt-5">
                <Stars rating={entry.rating} />
                <p className="mt-3 font-heading text-lg text-ivory">{entry.name}</p>
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

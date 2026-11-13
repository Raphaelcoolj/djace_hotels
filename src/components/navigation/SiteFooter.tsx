import Link from "next/link";
import connectDB from "@/lib/db";
import SiteSetting from "@/models/SiteSetting";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "Experiences", href: "/#experiences" },
  { label: "About the Hotel", href: "/#about" },
  { label: "Guest Feedback", href: "/feedback" },
];

async function getSettings(keys: string[]) {
  try {
    await connectDB();
    const docs = await SiteSetting.find({ key: { $in: keys } });
    const map: Record<string, string> = {};
    for (const d of docs) map[d.key] = d.value;
    return map;
  } catch {
    return {} as Record<string, string>;
  }
}

export default async function SiteFooter() {
  const settings = await getSettings([
    "contact_phone",
    "contact_email",
    "billing_address",
    "social_instagram",
    "social_facebook",
  ]);

  const socials = [
    settings.social_instagram && {
      label: "Instagram",
      href: settings.social_instagram,
    },
    settings.social_facebook && { label: "Facebook", href: settings.social_facebook },
  ].filter(Boolean) as { label: string; href: string }[];

  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex flex-col leading-none" aria-label="Luxury Hotel & Lounge — home">
              <span className="font-heading text-2xl font-medium uppercase tracking-[0.32em]">
                Luxury
              </span>
              <span className="mt-1.5 font-body text-[9px] uppercase tracking-[0.42em] text-ivory/50">
                Hotel &amp; Lounge
              </span>
            </Link>
            <p className="mt-6 max-w-sm font-body text-sm font-light leading-relaxed text-ivory/60">
              Experience unparalleled luxury and breathtaking views — your exclusive
              retreat for unforgettable moments.
            </p>
            {socials.length > 0 && (
              <div className="mt-8 flex gap-6">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-ivory/70 hover:text-gold"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="md:col-span-3 md:col-start-6">
            <p className="overline mb-6">Explore</p>
            <ul className="flex flex-col gap-3.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-ivory/65 transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="md:col-span-2">
            <p className="overline mb-6">Contact</p>
            <ul className="flex flex-col gap-3.5 font-body text-sm text-ivory/65">
              {settings.contact_phone && (
                <li>
                  <a
                    href={`tel:${settings.contact_phone.replace(/[^\d+]/g, "")}`}
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.billing_address && (
                <li className="leading-relaxed">{settings.billing_address}</li>
              )}
              {!settings.contact_phone && !settings.contact_email && (
                <li className="text-ivory/40">Contact the hotel for enquiries.</li>
              )}
            </ul>
          </div>

          {/* Reservation CTA */}
          <div className="md:col-span-2">
            <p className="overline mb-6">Reservations</p>
            <p className="mb-5 font-body text-sm font-light leading-relaxed text-ivory/60">
              Begin your stay with us.
            </p>
            <Link href="/rooms" className="btn btn-gold btn-sm">
              Reserve
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container flex flex-col items-center gap-3 py-6 text-center md:flex-row md:justify-between md:text-left">
          <p className="font-body text-xs tracking-wide text-ivory/40">
            &copy; {year} Luxury Hotel &amp; Lounge. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="font-body text-xs tracking-wide text-ivory/40 transition-colors hover:text-gold"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="font-body text-xs tracking-wide text-ivory/40 transition-colors hover:text-gold"
            >
              My Reservations
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

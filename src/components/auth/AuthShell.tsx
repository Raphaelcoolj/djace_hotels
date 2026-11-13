import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/navigation/SiteHeader";

const AUTH_IMAGE =
  "https://images.unsplash.com/photo-1542314831-c6a4d1409e1c?q=80&w=2000&auto=format&fit=crop";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader variant="solid" />
      <main>
        <div className="grid grid-cols-1 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2">
          {/* Brand panel */}
          <div className="relative hidden overflow-hidden bg-forest lg:block">
            <Image
              src={AUTH_IMAGE}
              alt="Luxury Hotel & Lounge at dusk"
              fill
              sizes="50vw"
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/50 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
              <Link
                href="/"
                className="group w-fit flex flex-col leading-none text-ivory transition-colors duration-300"
                aria-label="Luxury Hotel & Lounge — home"
              >
                <span className="font-heading text-3xl font-medium uppercase tracking-[0.32em]">
                  Luxury
                </span>
                <span className="mt-2 font-body text-[9px] uppercase tracking-[0.42em] text-ivory/60 transition-colors duration-300 group-hover:text-gold">
                  Hotel &amp; Lounge
                </span>
              </Link>
              <div>
                <div className="h-px w-16 bg-gold" />
                <p className="mt-6 max-w-sm font-heading text-2xl font-light leading-relaxed text-ivory xl:text-3xl">
                  Your reservations, payments and stays — in one place.
                </p>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="flex items-center justify-center bg-ivory px-6 py-16 sm:px-10 lg:py-20">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </main>
    </>
  );
}

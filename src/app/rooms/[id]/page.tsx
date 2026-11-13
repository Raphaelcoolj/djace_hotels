import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import { auth } from "../../../../auth";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/navigation/SiteFooter";
import RoomGallery from "@/components/rooms/RoomGallery";
import RoomCard from "@/components/rooms/RoomCard";
import BookingForm from "@/components/booking/BookingForm";
import Reveal from "@/components/ui/Reveal";
import { formatPrice } from "@/lib/format";

type RoomDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function RoomDetailsPage({
  params,
  searchParams,
}: RoomDetailPageProps) {
  await connectDB();
  const { id } = await params;
  const sp = await searchParams;
  const session = await auth();

  let room;
  try {
    room = await Room.findById(id);
  } catch {
    notFound();
  }

  if (!room || !room.isAvailable) {
    notFound();
  }

  const related = await Room.find({
    isAvailable: true,
    _id: { $ne: room._id },
  })
    .limit(3)
    .sort({ pricePerNight: -1 });

  const amenities: string[] = (room.amenities ?? []).filter(Boolean);
  const initialCheckIn = first(sp.checkIn);
  const initialCheckOut = first(sp.checkOut);

  return (
    <>
      <SiteHeader variant="solid" />
      <main className="pb-28 lg:pb-0">
        <div className="container pt-8 md:pt-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.2em] text-warmgrey">
              <li>
                <Link href="/rooms" className="transition-colors hover:text-gold">
                  Rooms
                </Link>
              </li>
              <li aria-hidden className="text-warmgrey/50">
                /
              </li>
              <li className="text-charcoal" aria-current="page">
                {room.name}
              </li>
            </ol>
          </nav>

          {/* Gallery */}
          <RoomGallery images={room.images ?? []} alt={room.name} />

          {/* Title block */}
          <div className="mt-10 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="overline">{room.roomClass || "Standard"}</p>
              <h1 className="heading-xl mt-4 text-charcoal">{room.name}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 font-body text-sm text-warmgrey">
                <span>
                  {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest" aria-hidden />
                  Currently accepting reservations
                </span>
              </div>
            </div>
            <p className="shrink-0 font-heading text-3xl text-charcoal md:text-4xl">
              ₦{formatPrice(room.pricePerNight)}
              <span className="font-body text-sm font-light text-warmgrey"> / night</span>
            </p>
          </div>

          {/* Details + booking */}
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="overline-muted">About this room</h2>
              <p className="mt-5 max-w-2xl font-body text-base md:text-[17px] font-light leading-relaxed text-charcoal/80">
                {room.description}
              </p>

              {amenities.length > 0 && (
                <div className="mt-12">
                  <h2 className="overline-muted">Amenities</h2>
                  <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
                    {amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-4 border-b border-line-soft pb-4 font-body text-sm text-charcoal"
                      >
                        <span className="h-px w-5 shrink-0 bg-gold" aria-hidden />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-12 border border-line bg-cream/60 p-6">
                <h2 className="font-heading text-xl text-charcoal">
                  How reservations work
                </h2>
                <ol className="mt-4 flex flex-col gap-3 font-body text-sm leading-relaxed text-warmgrey">
                  <li>
                    <span className="text-gold">01</span> — Request your dates and
                    we confirm availability personally.
                  </li>
                  <li>
                    <span className="text-gold">02</span> — Receive payment
                    instructions once approved.
                  </li>
                  <li>
                    <span className="text-gold">03</span> — Submit your payment
                    reference and your stay is confirmed.
                  </li>
                </ol>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div className="lg:sticky lg:top-28">
                <BookingForm
                  roomId={room._id.toString()}
                  pricePerNight={room.pricePerNight}
                  isAuthenticated={Boolean(session?.user?.id)}
                  initialCheckIn={initialCheckIn}
                  initialCheckOut={initialCheckOut}
                />
              </div>
            </div>
          </div>

          {/* Related rooms */}
          {related.length > 0 && (
            <section className="mt-20 border-t border-line pt-16">
              <div className="flex items-end justify-between gap-6">
                <h2 className="heading-lg text-charcoal">
                  You may also consider
                </h2>
                <Link
                  href="/rooms"
                  className="link-underline shrink-0 text-charcoal hover:text-gold"
                >
                  All rooms
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                {related.map((other, i) => (
                  <Reveal key={other._id.toString()} delay={((i + 1) as 1 | 2 | 3)}>
                    <RoomCard room={other} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile reservation bar */}
      <div
        aria-label="Reservation shortcut"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between gap-4 px-5 pt-3">
          <p className="font-heading text-lg leading-none text-charcoal">
            ₦{formatPrice(room.pricePerNight)}
            <span className="font-body text-xs font-light text-warmgrey"> / night</span>
          </p>
          <a href="#booking" className="btn btn-gold btn-sm">
            Reserve
          </a>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

import { Suspense } from "react";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/navigation/SiteFooter";
import RoomCard from "@/components/rooms/RoomCard";
import RoomFilterBar from "@/components/rooms/RoomFilterBar";
import EmptyState from "@/components/ui/EmptyState";
import Reveal from "@/components/ui/Reveal";

type RoomsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const sp = await searchParams;
  const guests = Number(first(sp.guests)) || 0;
  const activeClass = first(sp.class);
  const sort = first(sp.sort) || "price-asc";
  const checkIn = first(sp.checkIn);
  const checkOut = first(sp.checkOut);

  await connectDB();
  const allRooms = await Room.find({ isAvailable: true });

  const categories = Array.from(
    new Set(allRooms.map((r) => r.roomClass || "Standard"))
  ).sort((a, b) => a.localeCompare(b));

  let rooms = allRooms.filter((room) => {
    const roomClass = room.roomClass || "Standard";
    if (activeClass && roomClass !== activeClass) return false;
    if (guests && room.capacity < guests) return false;
    return true;
  });

  rooms = [...rooms].sort((a, b) => {
    if (sort === "price-desc") return b.pricePerNight - a.pricePerNight;
    if (sort === "name") return a.name.localeCompare(b.name);
    return a.pricePerNight - b.pricePerNight;
  });

  const hasFilters = Boolean(activeClass || guests || (checkIn && checkOut));

  return (
    <>
      <SiteHeader variant="solid" />
      <main>
        {/* Editorial introduction */}
        <section className="bg-cream pb-14 pt-16 md:pb-16 md:pt-24">
          <div className="container">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="overline">Accommodation</p>
                <h1 className="heading-xl mt-5 text-charcoal">Rooms &amp; Suites</h1>
                <p className="lede mt-6">
                  Select from our carefully curated collection of luxurious
                  accommodations.
                </p>
              </div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-warmgrey md:pb-3">
                {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
                {hasFilters ? " matching your search" : " available"}
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <Suspense fallback={<div className="h-[73px] border-y border-line" />}>
          <RoomFilterBar categories={categories} />
        </Suspense>

        {checkIn && checkOut && (
          <div className="container pt-6">
            <p className="font-body text-xs tracking-wide text-warmgrey">
              Your dates <span className="text-charcoal">{checkIn}</span> →{" "}
              <span className="text-charcoal">{checkOut}</span> will be carried into
              your reservation.
            </p>
          </div>
        )}

        {/* Collection */}
        <section className="section">
          <div className="container">
            {rooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room, i) => (
                  <Reveal
                    key={room._id.toString()}
                    delay={(((i % 3) + 1) as 1 | 2 | 3)}
                  >
                    <RoomCard
                      room={room}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </Reveal>
                ))}
              </div>
            ) : hasFilters ? (
              <EmptyState
                title="No rooms match your search"
                message="Try adjusting your dates, guests or room category to see more of our collection."
                actionLabel="Clear filters"
                actionHref="/rooms"
              />
            ) : (
              <EmptyState
                title="No rooms available"
                message="No rooms are currently available. Please check back later."
                actionLabel="Return home"
                actionHref="/"
              />
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

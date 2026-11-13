import Link from "next/link";
import type { IRoom } from "@/models/Room";
import RoomCard from "@/components/rooms/RoomCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

type FeaturedRoomsProps = {
  rooms: IRoom[];
};

export default function FeaturedRooms({ rooms }: FeaturedRoomsProps) {
  if (rooms.length === 0) return null;

  return (
    <section className="section bg-ivory">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            overline="Accommodation"
            title="Featured rooms & suites"
            lede="Each room is quietly considered — natural materials, generous light and everything you need for a restful stay."
          />
          <Reveal className="shrink-0">
            <Link href="/rooms" className="link-underline text-charcoal hover:text-gold">
              View all rooms
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {rooms.map((room, i) => (
            <Reveal key={room._id.toString()} delay={(i + 1) as 1 | 2 | 3}>
              <RoomCard room={room} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

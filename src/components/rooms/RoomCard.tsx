import Link from "next/link";
import type { IRoom } from "@/models/Room";
import { formatPrice } from "@/lib/format";
import SmartImage from "@/components/ui/SmartImage";

type RoomCardProps = {
  room: IRoom;
  sizes?: string;
  /** Layout variant for the listing grid */
  aspect?: "portrait" | "landscape";
};

export default function RoomCard({
  room,
  sizes = "(max-width: 768px) 100vw, 33vw",
  aspect = "portrait",
}: RoomCardProps) {
  const roomId = room._id.toString();

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/rooms/${roomId}`}
        className="block overflow-hidden"
        tabIndex={-1}
        aria-hidden
      >
        <SmartImage
          src={room.images?.[0]}
          alt={room.name}
          className={`w-full ${aspect === "portrait" ? "aspect-[4/5]" : "aspect-[4/3]"}`}
          imgClassName="transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
          sizes={sizes}
        />
      </Link>

      <div className="mt-6 flex items-baseline justify-between gap-4">
        <p className="overline-muted">{room.roomClass || "Standard"}</p>
        <p className="font-body text-xs tracking-wide text-warmgrey">
          {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
        </p>
      </div>

      <h3 className="heading-md mt-3 text-charcoal">
        <Link
          href={`/rooms/${roomId}`}
          className="transition-colors duration-300 group-hover:text-gold"
        >
          {room.name}
        </Link>
      </h3>

      <p className="body-sm mt-3 line-clamp-2">{room.description}</p>

      {room.amenities && room.amenities.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {room.amenities.slice(0, 3).map((a) => (
            <li key={a} className="font-body text-[11px] tracking-wide text-warmgrey">
              {a}
            </li>
          ))}
          {room.amenities.length > 3 && (
            <li className="font-body text-[11px] tracking-wide text-gold">
              +{room.amenities.length - 3} more
            </li>
          )}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5">
        <p className="font-heading text-xl text-charcoal">
          ₦{formatPrice(room.pricePerNight)}
          <span className="font-body text-xs font-light text-warmgrey"> / night</span>
        </p>
        <Link
          href={`/rooms/${roomId}`}
          className="link-underline text-charcoal hover:text-gold"
        >
          View room
        </Link>
      </div>
    </article>
  );
}

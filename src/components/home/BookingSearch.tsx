"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

type RoomOption = {
  id: string;
  name: string;
  roomClass: string;
  capacity: number;
};

type BookingSearchProps = {
  rooms: RoomOption[];
};

function toISODate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function BookingSearch({ rooms }: BookingSearchProps) {
  const router = useRouter();
  const today = useMemo(() => toISODate(new Date()), []);

  const roomClasses = useMemo(() => {
    const seen = new Map<string, string>();
    for (const room of rooms) {
      if (!seen.has(room.roomClass)) seen.set(room.roomClass, room.name);
    }
    return Array.from(seen.entries()).map(([value]) => ({
      value,
      label: value,
    }));
  }, [rooms]);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [roomClass, setRoomClass] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
      setError("Please choose both arrival and departure dates.");
      return;
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      setError("Departure must be after arrival.");
      return;
    }

    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests && guests !== "2") params.set("guests", guests);
    if (roomClass) params.set("class", roomClass);

    const query = params.toString();
    router.push(query ? `/rooms?${query}` : "/rooms");
  }

  return (
    <div className="relative z-20 -mt-14 md:-mt-16">
      <div className="container">
        <form
          onSubmit={handleSubmit}
          className="card grid grid-cols-1 gap-px bg-line md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.2fr_auto] p-0 overflow-hidden"
          aria-label="Search rooms"
        >
          <div className="bg-white px-6 py-5">
            <label htmlFor="bs-checkin" className="input-label">
              Arrival
            </label>
            <input
              id="bs-checkin"
              type="date"
              className="w-full border-0 bg-transparent p-0 font-body text-sm text-charcoal focus:outline-none focus:ring-0 [color-scheme:light]"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className="bg-white px-6 py-5">
            <label htmlFor="bs-checkout" className="input-label">
              Departure
            </label>
            <input
              id="bs-checkout"
              type="date"
              className="w-full border-0 bg-transparent p-0 font-body text-sm text-charcoal focus:outline-none focus:ring-0 [color-scheme:light]"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          <div className="bg-white px-6 py-5">
            <label htmlFor="bs-guests" className="input-label">
              Guests
            </label>
            <select
              id="bs-guests"
              className="w-full border-0 bg-transparent p-0 font-body text-sm text-charcoal focus:outline-none focus:ring-0"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={String(n)}>
                  {n} {n === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white px-6 py-5">
            <label htmlFor="bs-room" className="input-label">
              Room
            </label>
            <select
              id="bs-room"
              className="w-full border-0 bg-transparent p-0 font-body text-sm text-charcoal focus:outline-none focus:ring-0"
              value={roomClass}
              onChange={(e) => setRoomClass(e.target.value)}
            >
              <option value="">Any room</option>
              {roomClasses.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-stretch bg-white">
            <button type="submit" className="btn btn-gold w-full lg:w-auto px-10">
              Search Rooms
            </button>
          </div>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-3 font-body text-sm text-danger"
          >
            {error}
          </p>
        )}
        <p className="mt-3 font-body text-xs text-warmgrey">
          Reservations are confirmed personally by our team after your request.
        </p>
      </div>
    </div>
  );
}

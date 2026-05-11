import connectDB from "@/lib/db";
import Room from "@/models/Room";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";
import { formatPrice } from "@/lib/format";

import { auth } from "../../../../auth";
import LogoutButton from "@/components/LogoutButton";

export default async function RoomDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const session = await auth();
  
  let room;
  try {
    room = await Room.findById(id);
  } catch (e) {
    notFound();
  }

  if (!room || !room.isAvailable) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="bg-black/95 sticky top-0 w-full z-50 px-6 md:px-8 py-5 md:py-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
        <Link href="/" className="text-white font-headline text-lg md:text-3xl tracking-[0.2em] uppercase">
          LUXURY
        </Link>
        <div className="flex gap-4 md:gap-8 items-center">
          <Link href="/rooms" className="text-white font-body text-[10px] md:text-sm tracking-widest uppercase hover:text-accent-gold transition-colors">
            Rooms
          </Link>
          {session?.user?.email ? (
            <div className="flex gap-4 md:gap-8 items-center">
              <Link href="/dashboard" className="text-white font-body text-[10px] md:text-sm tracking-widest uppercase hover:text-accent-gold transition-colors">
                Dashboard
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex gap-4 md:gap-8 items-center">
              <Link href="/login" className="text-white font-body text-[10px] md:text-sm tracking-widest uppercase hover:text-accent-gold transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-white font-body text-[10px] md:text-sm tracking-widest uppercase border border-white/20 px-3 py-2 rounded hover:bg-white hover:text-black transition-all">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Room Details Column */}
          <div>
            <div className="w-full h-96 bg-surface mb-8 overflow-hidden rounded-lg shadow-xl relative">
              {room.images && room.images.length > 0 ? (
                <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">No Image Available</div>
              )}
            </div>
            
            <h1 className="text-4xl text-white font-headline tracking-widest uppercase mb-2">{room.name}</h1>
            <div className="text-sm text-accent-gold uppercase tracking-widest mb-6 font-semibold">{room.roomClass || "Standard"}</div>
            
            <p className="text-text-muted text-lg mb-8 leading-relaxed">
              {room.description}
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-8 border-t border-outline-ghost pt-8">
              <div>
                <h3 className="text-xs uppercase text-text-muted tracking-widest mb-2 font-semibold">Price</h3>
                <p className="text-2xl text-accent-gold font-headline">₦{formatPrice(room.pricePerNight)}<span className="text-sm text-text-muted font-body font-normal"> / night</span></p>
              </div>
              <div>
                <h3 className="text-xs uppercase text-text-muted tracking-widest mb-2 font-semibold">Capacity</h3>
                <p className="text-xl text-white font-body">{room.capacity} Persons</p>
              </div>
            </div>
            
            {room.amenities && room.amenities.length > 0 && (
              <div className="border-t border-outline-ghost pt-8">
                <h3 className="text-xs uppercase text-text-muted tracking-widest mb-4 font-semibold">Amenities</h3>
                <ul className="flex flex-wrap gap-4">
                  {room.amenities.map((amenity: string, i: number) => (
                    <li key={i} className="bg-surface border border-outline-ghost px-4 py-2 text-sm text-text-muted rounded">
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Booking Form Column */}
          <div>
            <BookingForm roomId={room._id.toString()} pricePerNight={room.pricePerNight} />
          </div>
          
        </div>
      </div>
    </main>
  );
}

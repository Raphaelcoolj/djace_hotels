import connectDB from "@/lib/db";
import Room from "@/models/Room";
import SiteSetting from "@/models/SiteSetting";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

import { auth } from "../../../auth";
import LogoutButton from "@/components/LogoutButton";

export default async function RoomsPage() {
  await connectDB();
  const rooms = await Room.find({ isAvailable: true }).sort({ pricePerNight: 1 });
  const phoneSetting = await SiteSetting.findOne({ key: "contact_phone" });
  const emailSetting = await SiteSetting.findOne({ key: "contact_email" });
  const session = await auth();

  return (
    <main className="min-h-screen bg-background">
      <nav className="bg-black/90 sticky top-0 w-full z-50 px-4 md:px-8 py-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
        <Link href="/" className="text-white font-headline text-2xl md:text-3xl tracking-widest uppercase">
          DJACE
        </Link>
        <div className="flex gap-4 md:gap-8 items-center">
          <Link href="/rooms" className="text-accent-gold font-body text-[10px] md:text-sm tracking-widest uppercase">
            Rooms
          </Link>
          <Link href="/feedback" className="hidden md:inline text-white font-body text-sm tracking-widest uppercase hover:text-accent-gold transition-colors">
            Feedback
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
              <Link href="/register" className="text-white font-body text-[10px] md:text-sm tracking-widest uppercase hover:text-accent-gold transition-colors border border-white/20 px-4 py-2 rounded hover:bg-white hover:text-black">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="container py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl text-text-main mb-6 uppercase tracking-widest font-headline">Rooms & Suites</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Select from our carefully curated collection of luxurious accommodations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room._id.toString()} className="card overflow-hidden group">
              <div className="h-64 relative bg-surface overflow-hidden">
                {room.images && room.images.length > 0 ? (
                  <img 
                    src={room.images[0]} 
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl text-text-main font-headline tracking-wide">{room.name}</h3>
                  <span className="text-accent-gold font-semibold">₦{formatPrice(room.pricePerNight)}<span className="text-sm text-text-muted font-normal"> / night</span></span>
                </div>
                <div className="text-xs text-accent-gold uppercase tracking-widest mb-4">{room.roomClass || "Standard"}</div>
                <p className="text-text-muted text-sm line-clamp-3 mb-6">
                  {room.description}
                </p>
                <div className="flex gap-4 mb-6 text-sm text-text-muted">
                  <span>Capacity: {room.capacity}</span>
                </div>
                <Link href={`/rooms/${room._id}`} className="btn btn-gold w-full text-center block">
                  View Details & Book
                </Link>
              </div>
            </div>
          ))}
          {rooms.length === 0 && (
            <div className="col-span-full text-center py-16 text-text-muted text-xl">
              No rooms are currently available. Please check back later.
            </div>
          )}
        </div>
      </div>

      <footer className="bg-surface-dim border-t border-outline-ghost py-16 text-center mt-16">
        <h2 className="font-headline text-2xl text-text-main mb-6 tracking-widest uppercase">Djace Hotels</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 mb-8 text-text-muted text-sm">
          <p>Contact: {phoneSetting?.value || "+1 (555) 123-4567"}</p>
          <p>Email: {emailSetting?.value || "reservations@djacehotels.com"}</p>
        </div>
        <p className="text-text-muted text-xs">&copy; {new Date().getFullYear()} Djace Hotels & Lounge. All rights reserved.</p>
      </footer>
    </main>
  );
}

import connectDB from "@/lib/db";
import Room from "@/models/Room";
import SiteSetting from "@/models/SiteSetting";
import Link from "next/link";
import Image from "next/image";
import { auth } from "../../auth";
import LogoutButton from "@/components/LogoutButton";
import { formatPrice } from "@/lib/format";

export default async function Home() {
  await connectDB();
  const rooms = await Room.find({ isAvailable: true }).limit(3);
  const heroSetting = await SiteSetting.findOne({ key: "hero_image" });
  const phoneSetting = await SiteSetting.findOne({ key: "contact_phone" });
  const emailSetting = await SiteSetting.findOne({ key: "contact_email" });
  
  const heroImageUrl = heroSetting?.value || "https://images.unsplash.com/photo-1542314831-c6a4d1409e1c?q=80&w=2000&auto=format&fit=crop";
  const session = await auth();

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 px-6 md:px-8 py-5 md:py-6 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10">
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

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-8">
        <div 
          className="absolute inset-0 z-[-1] bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="font-headline text-2xl sm:text-5xl md:text-6xl text-white mb-6 uppercase tracking-[0.1em] md:tracking-[0.2em] drop-shadow-2xl font-bold leading-tight">
            Luxury Hotel <br className="sm:hidden" /> & Lounge
          </h1>
          <p className="font-body text-sm md:text-xl text-white/80 mb-12 max-w-2xl mx-auto tracking-wide font-light italic leading-relaxed">
            Where refined elegance meets timeless comfort—your exclusive retreat for unforgettable moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Link href="/rooms" className="btn btn-gold w-full sm:w-auto text-sm md:text-lg px-10 py-4 md:py-5 min-w-[240px]">
              Book Your Stay
            </Link>
            {!session?.user?.email && (
              <Link href="/register" className="btn btn-primary w-full sm:w-auto text-sm md:text-lg px-10 py-4 md:py-5 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black transition-all min-w-[240px]">
                Register Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl text-text-main mb-4 uppercase tracking-widest">Featured Accommodations</h2>
            <div className="w-16 h-0.5 bg-accent-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-xl text-text-main font-headline tracking-wide">{room.name}</h3>
                    <span className="text-accent-gold font-body font-semibold">₦{formatPrice(room.pricePerNight)}<span className="text-sm text-text-muted font-normal">/night</span></span>
                  </div>
                  <p className="text-text-muted text-sm line-clamp-3 mb-6">
                    {room.description}
                  </p>
                  <Link href={`/rooms/${room._id}`} className="inline-block text-accent-gold font-body text-sm font-semibold tracking-widest uppercase hover:text-white transition-colors border-b border-accent-gold pb-1">
                    Discover More
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/rooms" className="btn btn-outline">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dim border-t border-outline-ghost py-16 text-center">
        <h2 className="font-headline text-2xl text-text-main mb-6 tracking-widest uppercase">Luxury Hotel</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 mb-8 text-text-muted text-sm">
          <p>Contact: {phoneSetting?.value || "+1 (555) 123-4567"}</p>
          <p>Email: {emailSetting?.value || "reservations@luxuryhotel.com"}</p>
        </div>
        <p className="text-text-muted text-xs">&copy; {new Date().getFullYear()} Luxury Hotel & Lounge. All rights reserved.</p>
      </footer>
    </main>
  );
}

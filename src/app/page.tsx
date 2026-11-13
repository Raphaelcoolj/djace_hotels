import connectDB from "@/lib/db";
import Room from "@/models/Room";
import SiteSetting from "@/models/SiteSetting";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/navigation/SiteFooter";
import Hero from "@/components/home/Hero";
import BookingSearch from "@/components/home/BookingSearch";
import FeaturedRooms from "@/components/home/FeaturedRooms";
import ExperiencesSection from "@/components/home/ExperiencesSection";
import AboutSection from "@/components/home/AboutSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1542314831-c6a4d1409e1c?q=80&w=2000&auto=format&fit=crop";

export default async function Home() {
  await connectDB();
  const [rooms, heroSetting, phoneSetting] = await Promise.all([
    Room.find({ isAvailable: true }),
    SiteSetting.findOne({ key: "hero_image" }),
    SiteSetting.findOne({ key: "contact_phone" }),
  ]);

  const heroImageUrl = heroSetting?.value || FALLBACK_HERO;
  const featured = rooms.slice(0, 3);

  const searchOptions = rooms.map((room) => ({
    id: room._id.toString(),
    name: room.name,
    roomClass: room.roomClass || "Standard",
    capacity: room.capacity,
  }));

  return (
    <>
      <SiteHeader variant="over-hero" />
      <main>
        <Hero imageUrl={heroImageUrl} />
        <BookingSearch rooms={searchOptions} />
        <FeaturedRooms rooms={featured} />
        <ExperiencesSection />
        <AboutSection imageUrl={heroImageUrl} />
        <TestimonialsSection />
        <CtaSection phone={phoneSetting?.value} />
      </main>
      <SiteFooter />
    </>
  );
}

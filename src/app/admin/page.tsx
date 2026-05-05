import { updateHeroImage, createRoom, updateSiteSettings, updateBookingStatus, promoteToAdmin } from "@/lib/adminActions";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import Booking from "@/models/Booking";
import Feedback from "@/models/Feedback";
import SiteSetting from "@/models/SiteSetting";
import AdminBookingActions from "@/components/AdminBookingActions";
import { HeroImageForm, SiteSettingsForm, CreateRoomForm, AdminPromotionForm, RoomManagementActions } from "@/components/AdminForms";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  await connectDB();
  const rooms = await Room.find().sort({ createdAt: -1 });
  const bookings = await Booking.find().populate("room user").sort({ createdAt: -1 }).limit(20);
  const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(20);

  const adminEmailSetting = await SiteSetting.findOne({ key: "admin_email" });
  const contactPhoneSetting = await SiteSetting.findOne({ key: "contact_phone" });
  const contactEmailSetting = await SiteSetting.findOne({ key: "contact_email" });
  const heroImageSetting = await SiteSetting.findOne({ key: "hero_image" });
  const bankNameSetting = await SiteSetting.findOne({ key: "bank_name" });
  const accountNumberSetting = await SiteSetting.findOne({ key: "account_number" });
  const accountNameSetting = await SiteSetting.findOne({ key: "account_name" });
  const billingAddressSetting = await SiteSetting.findOne({ key: "billing_address" });

  const currentSettings = {
    adminEmail: adminEmailSetting?.value,
    contactPhone: contactPhoneSetting?.value,
    contactEmail: contactEmailSetting?.value,
    bankName: bankNameSetting?.value,
    accountNumber: accountNumberSetting?.value,
    accountName: accountNameSetting?.value,
    billingAddress: billingAddressSetting?.value,
  };

  return (
    <>
      <nav className="bg-primary p-4 md:p-8 flex justify-between items-center border-b border-white/10">
        <Link href="/" className="text-white font-headline text-xl md:text-2xl tracking-widest uppercase">
          DJACE
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <span className="text-white/70 text-xs hidden sm:inline font-body">Admin Panel</span>
          <Link href="/" className="text-accent-gold text-[11px] md:text-sm tracking-widest uppercase hover:text-white transition-colors">
            Exit
          </Link>
          <LogoutButton />
        </div>
      </nav>

      <div className="container py-8 md:py-16 max-w-7xl">
        <div className="flex flex-col sm:row justify-between items-start sm:items-center gap-4 mb-12 border-b border-outline-ghost pb-6">
          <h1 className="text-3xl md:text-4xl text-text-main font-headline uppercase tracking-widest">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* Settings Column */}
        <div>
          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-headline tracking-widest text-text-main mb-6 uppercase">Site Settings</h2>
            
            <HeroImageForm />

            <h3 className="text-lg font-headline tracking-widest text-text-main mb-4 uppercase">Contact Information</h3>
            <SiteSettingsForm settings={currentSettings} />
          </div>

          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-headline tracking-widest text-text-main mb-6 uppercase">Admin Management</h2>
            <p className="text-sm text-text-muted mb-6">
              Enter the email of a registered user to grant them admin privileges.
            </p>
            <AdminPromotionForm />
          </div>
        </div>

        {/* Rooms Column */}
        <div>
          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-headline tracking-widest text-text-main mb-6 uppercase">Add New Room</h2>
            <CreateRoomForm />
          </div>
        </div>
      </div>

      {/* Existing Rooms List */}
      <h2 className="text-2xl font-headline tracking-widest text-text-main mt-16 mb-8 uppercase border-b border-outline-ghost pb-4">Manage Rooms</h2>
      <div className="overflow-x-auto card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-ghost bg-surface-dim">
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Name</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Price</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Capacity</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id.toString()} className="border-b border-outline-ghost hover:bg-surface-dim/50 transition-colors">
                <td className="p-4 font-body font-semibold text-text-main">{room.name}</td>
                <td className="p-4 text-accent-gold font-body">₦{formatPrice(room.pricePerNight)}</td>
                <td className="p-4 text-text-muted">{room.capacity}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded uppercase tracking-widest ${room.isAvailable ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {room.isAvailable ? "Available" : "Hidden"}
                  </span>
                </td>
                <td className="p-4">
                  <RoomManagementActions room={JSON.parse(JSON.stringify(room))} />
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted italic">No rooms added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bookings List */}
      <h2 className="text-2xl font-headline tracking-widest text-text-main mt-16 mb-8 uppercase border-b border-outline-ghost pb-4">Recent Bookings</h2>
      <div className="overflow-x-auto card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-ghost bg-surface-dim">
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Guest / Email</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Room</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Check In / Out</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Total</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id.toString()} className="border-b border-outline-ghost hover:bg-surface-dim/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-text-main">{booking.user?.name || "N/A"}</div>
                  <div className="text-xs text-text-muted">{booking.user?.email}</div>
                  {booking.paymentReference && (
                    <div className="mt-2 text-[10px] text-accent-gold uppercase tracking-tighter">
                      REF: {booking.paymentReference}
                    </div>
                  )}
                </td>
                <td className="p-4 text-text-main">{booking.room?.name || "N/A"}</td>
                <td className="p-4 text-sm text-text-muted">
                  {new Date(booking.checkInDate).toLocaleDateString()} <br /> 
                  <span className="text-outline-ghost">to</span> <br /> 
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </td>
                <td className="p-4 text-accent-gold font-semibold">₦{formatPrice(booking.totalPrice)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded uppercase tracking-widest border ${
                    booking.status === 'paid_confirmed' ? 'bg-accent-gold/10 text-accent-gold border-accent-gold/20' : 
                    booking.status === 'approved_awaiting_payment' ? 'bg-blue-900/20 text-blue-400 border-blue-900/30' :
                    booking.status === 'declined' ? 'bg-red-900/20 text-red-400 border-red-900/30' :
                    'bg-surface-dim text-text-muted border-outline-ghost'
                  }`}>
                    {booking.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-4">
                  {booking.status === "pending_approval" && (
                    <AdminBookingActions bookingId={booking._id.toString()} />
                  )}
                  {booking.status === "paid_confirmed" && (
                    <span className="text-accent-gold font-semibold text-xs tracking-widest uppercase">Paid</span>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-muted italic">No bookings received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Feedbacks List */}
      <h2 className="text-2xl font-headline tracking-widest text-text-main mt-16 mb-8 uppercase border-b border-outline-ghost pb-4">Recent Feedback</h2>
      <div className="overflow-x-auto card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-ghost bg-surface-dim">
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Name</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Rating</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Message</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(feedback => (
              <tr key={feedback._id.toString()} className="border-b border-outline-ghost hover:bg-surface-dim/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-text-main">{feedback.name}</div>
                  <div className="text-xs text-text-muted">{feedback.email}</div>
                </td>
                <td className="p-4">
                  {feedback.rating ? (
                    <span className="text-accent-gold text-lg">
                      {"★".repeat(feedback.rating)}{"☆".repeat(5 - feedback.rating)}
                    </span>
                  ) : (
                    <span className="text-text-muted">N/A</span>
                  )}
                </td>
                <td className="p-4 text-sm text-text-muted max-w-md">{feedback.message}</td>
              </tr>
            ))}
            {feedbacks.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-text-muted italic">No feedback received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SiteSetting from "@/models/SiteSetting";
import LogoutButton from "@/components/LogoutButton";
import PaymentForm from "@/components/PaymentForm";
import { formatPrice } from "@/lib/format";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const bookings = await Booking.find({ user: session.user.id })
    .populate("room", "name image") // populating room to get name
    .sort({ createdAt: -1 });

  const bankName = await SiteSetting.findOne({ key: "bank_name" });
  const accountNumber = await SiteSetting.findOne({ key: "account_number" });
  const accountName = await SiteSetting.findOne({ key: "account_name" });
  const billingAddress = await SiteSetting.findOne({ key: "billing_address" });
  const phoneSetting = await SiteSetting.findOne({ key: "contact_phone" });
  const emailSetting = await SiteSetting.findOne({ key: "contact_email" });

  return (
    <main className="min-h-screen bg-background">
      <nav className="bg-primary p-4 md:p-8 flex justify-between items-center border-b border-white/10">
        <Link href="/" className="text-white font-headline text-xl md:text-2xl tracking-widest uppercase">
          DJACE
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <span className="text-white/70 text-xs hidden sm:inline font-body">Welcome, {session.user.name}</span>
          {session.user.role === "admin" && (
            <Link href="/admin" className="text-accent-gold text-[10px] md:text-sm tracking-widest uppercase hover:text-white transition-colors">
              Admin
            </Link>
          )}
          <LogoutButton />
        </div>
      </nav>

      <div className="container py-16 max-w-4xl">
        <h1 className="text-4xl text-text-main font-headline tracking-widest uppercase mb-12">Your Reservations</h1>

        {bookings.length === 0 ? (
          <div className="card p-16 text-center">
            <h2 className="text-xl text-text-main mb-4">No reservations found</h2>
            <p className="text-text-muted mb-8">You haven't booked any rooms yet.</p>
            <Link href="/rooms" className="btn btn-gold">Browse Rooms</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((booking) => (
              <div key={booking._id.toString()} className="card p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                  <h3 className="text-xl font-headline text-text-main tracking-wide mb-2">{booking.room?.name || "Room No Longer Available"}</h3>
                  <div className="text-sm text-text-muted flex flex-col gap-1">
                    <p>Check In: <span className="text-text-main">{new Date(booking.checkInDate).toLocaleDateString()}</span></p>
                    <p>Check Out: <span className="text-text-main">{new Date(booking.checkOutDate).toLocaleDateString()}</span></p>
                    <p className="mt-2 text-base">Total: <span className="text-accent-gold font-semibold">₦{formatPrice(booking.totalPrice)}</span></p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 min-w-[200px] text-right">
                  <span className={`inline-block px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded text-center ${
                    booking.status === 'paid_confirmed' ? 'bg-accent-gold text-primary' : 'bg-surface-dim text-text-main border border-outline-ghost'
                  }`}>
                    {booking.status.replace(/_/g, ' ')}
                  </span>

                  {booking.status === "approved_awaiting_payment" && (
                    <div className="mt-4 p-4 bg-surface-dim border border-accent-gold/20 text-left">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-accent-gold mb-2">Payment Instructions</h4>
                      <div className="text-[11px] text-text-muted flex flex-col gap-1">
                        <p>Bank: <span className="text-text-main font-semibold">{bankName?.value || "Not Set"}</span></p>
                        <p>A/C Number: <span className="text-text-main font-semibold">{accountNumber?.value || "Not Set"}</span></p>
                        <p>A/C Name: <span className="text-text-main font-semibold">{accountName?.value || "Not Set"}</span></p>
                        <p className="mt-1">Billing Address: <span className="text-text-main">{billingAddress?.value || "N/A"}</span></p>
                      </div>
                    </div>
                  )}

                  {booking.status === "approved_awaiting_payment" && (
                    <PaymentForm bookingId={booking._id.toString()} />
                  )}
                  {booking.status === "paid_confirmed" && (
                    <div className="flex flex-col gap-2">
                      <span className="inline-block px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded text-center bg-accent-gold text-primary">
                        Paid
                      </span>
                      <a 
                        href={`https://wa.me/?text=${encodeURIComponent(`Hello, I've just paid for my booking at Djace Hotels.\n\nBooking ID: ${booking._id}\nReference: ${booking.paymentReference}\nRoom: ${booking.room?.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-center text-text-muted hover:text-accent-gold transition-colors underline"
                      >
                        Send Receipt via WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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

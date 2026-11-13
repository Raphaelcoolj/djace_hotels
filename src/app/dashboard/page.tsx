import Link from "next/link";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import SiteSetting from "@/models/SiteSetting";
import { auth } from "../../../auth";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/navigation/SiteFooter";
import BookingCard, {
  type DashboardBooking,
} from "@/components/dashboard/BookingCard";
import EmptyState from "@/components/ui/EmptyState";
import Reveal from "@/components/ui/Reveal";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();
  const [
    bookingDocs,
    user,
    bankName,
    accountNumber,
    accountName,
    billingAddress,
    contactPhone,
    contactEmail,
  ] = await Promise.all([
    Booking.find({ user: session.user.id })
      .populate("room", "name images roomClass")
      .sort({ createdAt: -1 }),
    User.findById(session.user.id).select("name email createdAt"),
    SiteSetting.findOne({ key: "bank_name" }),
    SiteSetting.findOne({ key: "account_number" }),
    SiteSetting.findOne({ key: "account_name" }),
    SiteSetting.findOne({ key: "billing_address" }),
    SiteSetting.findOne({ key: "contact_phone" }),
    SiteSetting.findOne({ key: "contact_email" }),
  ]);

  const bookings: DashboardBooking[] = bookingDocs.map((b) => {
    const room =
      b.room && typeof b.room === "object" && "name" in (b.room as object)
        ? (b.room as { name?: string; images?: string[]; roomClass?: string })
        : null;
    return {
      _id: b._id.toString(),
      checkInDate: new Date(b.checkInDate).toISOString(),
      checkOutDate: new Date(b.checkOutDate).toISOString(),
      totalPrice: b.totalPrice,
      status: b.status,
      paymentReference: b.paymentReference ?? undefined,
      room,
    };
  });

  const bank = {
    bankName: bankName?.value,
    accountNumber: accountNumber?.value,
    accountName: accountName?.value,
    billingAddress: billingAddress?.value,
  };

  const firstName = session.user.name?.split(" ")[0] ?? "there";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <SiteHeader variant="solid" />
      <main>
        {/* Welcome band */}
        <section className="bg-cream pb-12 pt-14 md:pb-14 md:pt-20">
          <div className="container">
            <p className="overline">Guest portal</p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h1 className="heading-xl text-charcoal">
                Welcome back, {firstName}
              </h1>
              <p className="font-body text-sm text-warmgrey">
                {bookings.length}{" "}
                {bookings.length === 1 ? "reservation" : "reservations"} on file
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Reservations */}
            <div className="lg:col-span-8">
              <h2 className="overline-muted mb-6">Your reservations</h2>

              {bookings.length === 0 ? (
                <EmptyState
                  title="No reservations yet"
                  message="When you request a reservation, it will appear here with its live status and payment details."
                  actionLabel="Browse rooms"
                  actionHref="/rooms"
                />
              ) : (
                <div className="flex flex-col gap-6">
                  {bookings.map((booking, i) => (
                    <Reveal
                      key={booking._id}
                      delay={(((i % 3) + 1) as 1 | 2 | 3)}
                    >
                      <BookingCard booking={booking} bank={bank} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6 lg:col-span-4">
              <div className="card p-6">
                <h2 className="overline">Profile</h2>
                <p className="mt-4 font-heading text-2xl text-charcoal">
                  {session.user.name}
                </p>
                <p className="mt-1 font-body text-sm text-warmgrey">
                  {session.user.email}
                </p>
                {memberSince && (
                  <p className="mt-4 border-t border-line pt-4 font-body text-xs tracking-wide text-warmgrey">
                    Guest since {memberSince}
                  </p>
                )}
              </div>

              <div className="card p-6">
                <h2 className="overline">Quick actions</h2>
                <nav className="mt-4 flex flex-col gap-3">
                  <Link
                    href="/rooms"
                    className="link-underline w-fit text-charcoal hover:text-gold"
                  >
                    Browse rooms
                  </Link>
                  <Link
                    href="/feedback"
                    className="link-underline w-fit text-charcoal hover:text-gold"
                  >
                    Share feedback
                  </Link>
                  <Link
                    href="/"
                    className="link-underline w-fit text-charcoal hover:text-gold"
                  >
                    Back to home
                  </Link>
                </nav>
              </div>

              <div className="card bg-cream/60 p-6">
                <h2 className="overline">Need help?</h2>
                <p className="mt-4 font-body text-sm leading-relaxed text-warmgrey">
                  Our team is happy to assist with reservations, payments or
                  changes to your stay.
                </p>
                <div className="mt-4 flex flex-col gap-2 font-body text-sm">
                  {contactPhone?.value && (
                    <a
                      href={`tel:${contactPhone.value.replace(/[^\d+]/g, "")}`}
                      className="text-charcoal transition-colors hover:text-gold"
                    >
                      {contactPhone.value}
                    </a>
                  )}
                  {contactEmail?.value && (
                    <a
                      href={`mailto:${contactEmail.value}`}
                      className="text-charcoal transition-colors hover:text-gold"
                    >
                      {contactEmail.value}
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

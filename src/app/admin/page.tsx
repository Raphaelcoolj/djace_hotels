import Link from "next/link";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import Booking from "@/models/Booking";
import Feedback from "@/models/Feedback";
import SiteSetting from "@/models/SiteSetting";
import User from "@/models/User";
import { auth } from "../../../auth";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/navigation/SiteFooter";
import AdminStats, { type AdminStat } from "@/components/admin/AdminStats";
import BookingsTable, {
  type AdminBookingRow,
} from "@/components/admin/BookingsTable";
import RoomsTable from "@/components/admin/RoomsTable";
import {
  HeroImageForm,
  SiteSettingsForm,
  CreateRoomForm,
  AdminPromotionForm,
} from "@/components/AdminForms";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/format";

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  await connectDB();

  const [
    rooms,
    bookingDocs,
    feedbacks,
    guests,
    pendingCount,
    awaitingCount,
    totalBookings,
    revenueAgg,
    adminEmailSetting,
    contactPhoneSetting,
    contactEmailSetting,
    bankNameSetting,
    accountNumberSetting,
    accountNameSetting,
    billingAddressSetting,
    socialInstagramSetting,
    socialFacebookSetting,
    heroImageSetting,
  ] = await Promise.all([
    Room.find().sort({ createdAt: -1 }),
    Booking.find().populate("room user").sort({ createdAt: -1 }).limit(30),
    Feedback.find().sort({ createdAt: -1 }).limit(12),
    User.find().select("name email role createdAt").sort({ createdAt: -1 }).limit(50),
    Booking.countDocuments({ status: "pending_approval" }),
    Booking.countDocuments({ status: "approved_awaiting_payment" }),
    Booking.countDocuments(),
    Booking.aggregate([
      { $match: { status: "paid_confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
    SiteSetting.findOne({ key: "admin_email" }),
    SiteSetting.findOne({ key: "contact_phone" }),
    SiteSetting.findOne({ key: "contact_email" }),
    SiteSetting.findOne({ key: "bank_name" }),
    SiteSetting.findOne({ key: "account_number" }),
    SiteSetting.findOne({ key: "account_name" }),
    SiteSetting.findOne({ key: "billing_address" }),
    SiteSetting.findOne({ key: "social_instagram" }),
    SiteSetting.findOne({ key: "social_facebook" }),
    SiteSetting.findOne({ key: "hero_image" }),
  ]);

  const stats: AdminStat[] = [
    {
      label: "Rooms",
      value: String(rooms.length),
      hint: `${rooms.filter((r) => r.isAvailable).length} visible to guests`,
    },
    {
      label: "Pending requests",
      value: String(pendingCount),
      hint: pendingCount > 0 ? "Awaiting your approval" : "All caught up",
    },
    {
      label: "Awaiting payment",
      value: String(awaitingCount),
      hint: "Approved, payment pending",
    },
    {
      label: "Confirmed revenue",
      value: `₦${formatPrice(revenueAgg[0]?.total ?? 0)}`,
      hint: "From confirmed payments",
    },
    {
      label: "Guests",
      value: String(await User.countDocuments()),
      hint: `${totalBookings} bookings total`,
    },
  ];

  const bookings: AdminBookingRow[] = bookingDocs.map((b) => {
    const user =
      b.user && typeof b.user === "object" && "name" in (b.user as object)
        ? (b.user as { name?: string; email?: string })
        : null;
    const room =
      b.room && typeof b.room === "object" && "name" in (b.room as object)
        ? (b.room as { name?: string })
        : null;
    return {
      _id: b._id.toString(),
      guestName: user?.name,
      guestEmail: user?.email,
      roomName: room?.name,
      checkIn: new Date(b.checkInDate).toISOString(),
      checkOut: new Date(b.checkOutDate).toISOString(),
      totalPrice: b.totalPrice,
      status: b.status,
      paymentReference: b.paymentReference ?? undefined,
    };
  });

  const currentSettings = {
    adminEmail: adminEmailSetting?.value,
    contactPhone: contactPhoneSetting?.value,
    contactEmail: contactEmailSetting?.value,
    bankName: bankNameSetting?.value,
    accountNumber: accountNumberSetting?.value,
    accountName: accountNameSetting?.value,
    billingAddress: billingAddressSetting?.value,
    socialInstagram: socialInstagramSetting?.value,
    socialFacebook: socialFacebookSetting?.value,
  };

  return (
    <>
      <SiteHeader variant="solid" />
      <main>
        {/* Page header */}
        <section className="bg-cream pb-12 pt-14 md:pb-14 md:pt-20">
          <div className="container">
            <p className="overline">Administration</p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h1 className="heading-xl text-charcoal">Hotel operations</h1>
              <p className="font-body text-sm text-warmgrey">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="mt-8">
              <AdminStats stats={stats} />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Main column */}
            <div className="flex min-w-0 flex-col gap-10 lg:col-span-8">
              {/* Bookings */}
              <div className="card p-0">
                <div className="flex items-end justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
                  <div>
                    <p className="overline">Reservations</p>
                    <h2 className="mt-2 font-heading text-2xl text-charcoal">
                      Recent bookings
                    </h2>
                  </div>
                  <p className="hidden font-body text-xs text-warmgrey sm:block">
                    Latest 30
                  </p>
                </div>
                <BookingsTable bookings={bookings} />
              </div>

              {/* Rooms */}
              <div className="card p-0">
                <div className="flex items-end justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
                  <div>
                    <p className="overline">Inventory</p>
                    <h2 className="mt-2 font-heading text-2xl text-charcoal">
                      Manage rooms
                    </h2>
                  </div>
                  <Link
                    href="/rooms"
                    className="link-underline font-body text-xs text-charcoal hover:text-gold"
                  >
                    View public listing
                  </Link>
                </div>
                <RoomsTable rooms={JSON.parse(JSON.stringify(rooms))} />
              </div>

              {/* Guests */}
              <div className="card p-0">
                <div className="border-b border-line px-5 py-5 sm:px-6">
                  <p className="overline">People</p>
                  <h2 className="mt-2 font-heading text-2xl text-charcoal">
                    Registered guests
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left">
                    <thead>
                      <tr className="border-b border-line">
                        <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey sm:px-6">
                          Name
                        </th>
                        <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
                          Email
                        </th>
                        <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
                          Role
                        </th>
                        <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest) => (
                        <tr
                          key={guest._id.toString()}
                          className="border-b border-line/70 transition-colors hover:bg-cream/60"
                        >
                          <td className="px-5 py-4 font-body text-sm font-medium text-charcoal sm:px-6">
                            {guest.name}
                          </td>
                          <td className="px-5 py-4 font-body text-sm text-warmgrey">
                            {guest.email}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 font-body text-[10px] font-medium uppercase tracking-[0.16em] ${
                                guest.role === "admin"
                                  ? "bg-gold/15 text-gold-deep border border-gold/40"
                                  : "bg-cream text-warmgrey border border-line"
                              }`}
                            >
                              {guest.role}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-body text-xs text-warmgrey">
                            {formatDate(guest.createdAt)}
                          </td>
                        </tr>
                      ))}
                      {guests.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-10 text-center font-body text-sm text-warmgrey"
                          >
                            No registered users yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Feedback */}
              <div className="card p-0">
                <div className="border-b border-line px-5 py-5 sm:px-6">
                  <p className="overline">Voices</p>
                  <h2 className="mt-2 font-heading text-2xl text-charcoal">
                    Guest feedback
                  </h2>
                </div>
                {feedbacks.length === 0 ? (
                  <div className="p-6">
                    <EmptyState
                      title="No feedback yet"
                      message="Guest reviews submitted through the feedback page will appear here."
                    />
                  </div>
                ) : (
                  <ul className="divide-y divide-line">
                    {feedbacks.map((feedback) => (
                      <li key={feedback._id.toString()} className="px-5 py-5 sm:px-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div>
                            <span className="font-body text-sm font-medium text-charcoal">
                              {feedback.name}
                            </span>
                            <span className="ml-3 font-body text-xs text-warmgrey">
                              {feedback.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {feedback.rating != null && (
                              <span className="font-body text-sm tracking-[0.2em] text-gold">
                                {"★".repeat(feedback.rating)}
                                <span className="text-line">
                                  {"★".repeat(5 - feedback.rating)}
                                </span>
                              </span>
                            )}
                            <span className="font-body text-[10px] uppercase tracking-[0.16em] text-warmgrey">
                              {formatDate(feedback.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 font-body text-sm leading-relaxed text-warmgrey">
                          {feedback.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="flex min-w-0 flex-col gap-8 self-start lg:col-span-4">
              <div className="card p-6">
                <p className="overline">Quick actions</p>
                <h2 className="mt-2 font-heading text-2xl text-charcoal">
                  Add new room
                </h2>
                <div className="mt-5">
                  <CreateRoomForm />
                </div>
              </div>

              <div className="card p-6">
                <p className="overline">Configuration</p>
                <h2 className="mt-2 font-heading text-2xl text-charcoal">
                  Site settings
                </h2>
                <div className="mt-5">
                  <HeroImageForm currentImageUrl={heroImageSetting?.value || null} />
                  <div className="pt-6">
                    <SiteSettingsForm settings={currentSettings} />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <p className="overline">Access</p>
                <h2 className="mt-2 font-heading text-2xl text-charcoal">
                  Admin management
                </h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-warmgrey">
                  Enter the email of a registered user to grant them admin
                  privileges.
                </p>
                <div className="mt-5">
                  <AdminPromotionForm />
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

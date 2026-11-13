"use client";

import { useMemo, useState } from "react";
import AdminBookingActions from "@/components/AdminBookingActions";
import StatusBadge, { statusLabel } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/format";

export type AdminBookingRow = {
  _id: string;
  guestName?: string;
  guestEmail?: string;
  roomName?: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  paymentReference?: string;
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending_approval", label: "Pending" },
  { key: "approved_awaiting_payment", label: "Awaiting payment" },
  { key: "paid_confirmed", label: "Confirmed" },
  { key: "declined", label: "Declined" },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BookingsTable({ bookings }: { bookings: AdminBookingRow[] }) {
  const [filter, setFilter] = useState<string>("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: bookings.length };
    for (const b of bookings) {
      map[b.status] = (map[b.status] ?? 0) + 1;
    }
    return map;
  }, [bookings]);

  const visible = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter]
  );

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line px-5 py-4 sm:px-6">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const count = counts[f.key] ?? 0;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 border px-3 py-1.5 font-body text-[10px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 cursor-pointer ${
                active
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-line text-warmgrey hover:border-charcoal hover:text-charcoal"
              }`}
            >
              {f.label}
              <span className={active ? "text-gold" : "text-warmgrey"}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey sm:px-6">
                Guest
              </th>
              <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
                Room
              </th>
              <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
                Stay
              </th>
              <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
                Total
              </th>
              <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
                Status
              </th>
              <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((b) => (
              <tr
                key={b._id}
                className="border-b border-line/70 transition-colors hover:bg-cream/60"
              >
                <td className="px-5 py-4 sm:px-6">
                  <div className="font-body text-sm font-medium text-charcoal">
                    {b.guestName ?? "Guest"}
                  </div>
                  {b.guestEmail && (
                    <div className="mt-0.5 font-body text-xs text-warmgrey">
                      {b.guestEmail}
                    </div>
                  )}
                  {b.paymentReference && (
                    <div className="mt-1.5 font-body text-[10px] uppercase tracking-[0.16em] text-gold-deep">
                      REF {b.paymentReference}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 font-body text-sm text-charcoal">
                  {b.roomName ?? "—"}
                </td>
                <td className="px-5 py-4 font-body text-xs leading-relaxed text-warmgrey">
                  {formatDate(b.checkIn)}
                  <span className="mx-1.5 text-line">—</span>
                  {formatDate(b.checkOut)}
                </td>
                <td className="px-5 py-4 font-heading text-lg text-charcoal">
                  ₦{formatPrice(b.totalPrice)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-5 py-4">
                  {b.status === "pending_approval" ? (
                    <AdminBookingActions bookingId={b._id} />
                  ) : b.status === "paid_confirmed" ? (
                    <span className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-forest">
                      Payment received
                    </span>
                  ) : (
                    <span
                      className="font-body text-[10px] uppercase tracking-[0.16em] text-warmgrey"
                      title={statusLabel(b.status)}
                    >
                      No action
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center font-body text-sm text-warmgrey"
                >
                  {bookings.length === 0
                    ? "No bookings received yet."
                    : "No bookings match this filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

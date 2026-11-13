import Link from "next/link";
import StatusBadge, { statusNextSteps } from "@/components/ui/StatusBadge";
import PaymentForm from "@/components/PaymentForm";
import SmartImage from "@/components/ui/SmartImage";
import { formatPrice } from "@/lib/format";

export type DashboardBooking = {
  _id: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  paymentReference?: string;
  room?: {
    name?: string;
    images?: string[];
    roomClass?: string;
  } | null;
};

type BankDetails = {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  billingAddress?: string;
};

type BookingCardProps = {
  booking: DashboardBooking;
  bank: BankDetails;
};

const STEPS = [
  { key: "requested", label: "Requested" },
  { key: "approved", label: "Approved" },
  { key: "payment", label: "Payment" },
  { key: "confirmed", label: "Confirmed" },
];

function currentStepIndex(status: string) {
  switch (status) {
    case "pending_approval":
      return 0;
    case "approved_awaiting_payment":
      return 1;
    case "paid_confirmed":
      return 3;
    default:
      return -1;
  }
}

function BookingSteps({ status }: { status: string }) {
  const active = currentStepIndex(status);
  if (active < 0) return null;

  return (
    <ol className="flex items-start gap-2" aria-label="Reservation progress">
      {STEPS.map((step, i) => {
        const done = i <= active;
        const isCurrent = i === active;
        return (
          <li key={step.key} className="flex flex-1 flex-col items-start gap-2">
            <div className="flex w-full items-center">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-body text-[10px] ${
                  done
                    ? "bg-forest text-ivory"
                    : "border border-line bg-white text-warmgrey"
                } ${isCurrent ? "ring-2 ring-gold ring-offset-2 ring-offset-white" : ""}`}
                aria-hidden
              >
                {done ? "✓" : i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={`h-px flex-1 ${i < active ? "bg-forest" : "bg-line"}`}
                  aria-hidden
                />
              )}
            </div>
            <span
              className={`font-body text-[10px] uppercase tracking-[0.12em] ${
                done ? "text-charcoal" : "text-warmgrey"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BookingCard({ booking, bank }: BookingCardProps) {
  const roomName = booking.room?.name || "Room no longer available";
  const roomImage = booking.room?.images?.[0];
  const isPaid = booking.status === "paid_confirmed";
  const isApproved = booking.status === "approved_awaiting_payment";
  const isDeclined = booking.status === "declined";

  return (
    <article className="card p-6 md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-5">
          <div className="hidden h-20 w-24 shrink-0 sm:block">
            <SmartImage
              src={roomImage}
              alt={roomName}
              className="h-full w-full"
              sizes="96px"
            />
          </div>
          <div>
            <p className="overline-muted">{booking.room?.roomClass ?? "Reservation"}</p>
            <h3 className="heading-md mt-2 text-charcoal">{roomName}</h3>
            <p className="mt-2 font-body text-sm text-warmgrey">
              {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <StatusBadge status={booking.status} />
          <p className="mt-3 font-heading text-2xl text-charcoal">
            ₦{formatPrice(booking.totalPrice)}
          </p>
        </div>
      </div>

      {!isDeclined && (
        <div className="mt-7 border-t border-line pt-6">
          <BookingSteps status={booking.status} />
        </div>
      )}

      <p className="mt-6 bg-cream/70 px-4 py-3 font-body text-xs leading-relaxed text-warmgrey">
        {statusNextSteps(booking.status)}
      </p>

      {isApproved && (
        <>
          <div className="mt-5 border border-gold/30 bg-gold/5 p-5">
            <p className="overline">Payment instructions</p>
            <dl className="mt-4 grid grid-cols-1 gap-2.5 font-body text-sm sm:grid-cols-2">
              <div className="flex gap-2">
                <dt className="text-warmgrey">Bank:</dt>
                <dd className="font-medium text-charcoal">{bank.bankName || "Not set"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-warmgrey">A/C number:</dt>
                <dd className="font-medium text-charcoal">
                  {bank.accountNumber || "Not set"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-warmgrey">A/C name:</dt>
                <dd className="font-medium text-charcoal">
                  {bank.accountName || "Not set"}
                </dd>
              </div>
              {bank.billingAddress && (
                <div className="flex gap-2">
                  <dt className="text-warmgrey">Address:</dt>
                  <dd className="font-medium text-charcoal">{bank.billingAddress}</dd>
                </div>
              )}
            </dl>
          </div>
          <PaymentForm bookingId={booking._id} />
        </>
      )}

      {isPaid && (
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex w-fit items-center gap-2 bg-forest px-4 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-ivory">
            Payment received
          </span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Hello, I've just paid for my booking at Luxury Hotel.\n\nBooking ID: ${booking._id}\nReference: ${booking.paymentReference}\nRoom: ${roomName}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-charcoal hover:text-gold"
          >
            Send receipt via WhatsApp
          </a>
        </div>
      )}

      {isDeclined && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <Link href="/rooms" className="btn btn-outline btn-sm">
            Try other rooms
          </Link>
        </div>
      )}
    </article>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { createBooking } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

type BookingFormProps = {
  roomId: string;
  pricePerNight: number;
  isAuthenticated: boolean;
  initialCheckIn?: string;
  initialCheckOut?: string;
};

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function BookingForm({
  roomId,
  pricePerNight,
  isAuthenticated,
  initialCheckIn = "",
  initialCheckOut = "",
}: BookingFormProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = todayISO();

  let totalDays = 0;
  if (checkIn && checkOut && checkOut > checkIn) {
    const diffTime =
      new Date(`${checkOut}T00:00:00`).getTime() -
      new Date(`${checkIn}T00:00:00`).getTime();
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  const totalPrice = totalDays > 0 ? totalDays * pricePerNight : 0;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const res = await createBooking(formData);
      if (res?.error) {
        setError(res.error);
        toast.error(res.error);
      } else {
        toast.success("Reservation request sent successfully!");
        setCheckIn("");
        setCheckOut("");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="card p-6 md:p-8" id="booking">
        <p className="overline">Reservations</p>
        <h2 className="heading-lg mt-4 text-charcoal">Reserve this room</h2>
        <p className="body-sm mt-4">
          Sign in to choose your dates and request a reservation. Creating an
          account takes less than a minute.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/login" className="btn btn-gold btn-block">
            Sign in to reserve
          </Link>
          <Link href="/register" className="btn btn-outline btn-block">
            Create an account
          </Link>
        </div>
        <p className="mt-6 border-t border-line pt-5 font-body text-xs leading-relaxed text-warmgrey">
          Reservations are confirmed personally by our team. Payment is arranged
          after approval.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6 md:p-8" id="booking">
      <p className="overline">Reservations</p>
      <h2 className="heading-lg mt-4 text-charcoal">Reserve this room</h2>
      <p className="body-sm mt-3">
        Enter your dates to request a reservation. Our team will confirm
        availability personally.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 border border-danger/30 bg-danger/5 px-4 py-3 font-body text-sm text-danger"
        >
          {error}
        </div>
      )}

      <form action={handleSubmit} className="mt-7">
        <input type="hidden" name="roomId" value={roomId} />
        <input type="hidden" name="totalPrice" value={totalPrice} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="input-group mb-0">
            <label className="input-label" htmlFor="bf-checkin">
              Arrival
            </label>
            <input
              id="bf-checkin"
              type="date"
              name="checkInDate"
              className="input-field"
              required
              min={today}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut && e.target.value && checkOut <= e.target.value) {
                  setCheckOut("");
                }
              }}
            />
          </div>
          <div className="input-group mb-0">
            <label className="input-label" htmlFor="bf-checkout">
              Departure
            </label>
            <input
              id="bf-checkout"
              type="date"
              name="checkOutDate"
              className="input-field"
              required
              min={checkIn ? addDays(checkIn, 1) : today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        {totalDays > 0 && totalPrice > 0 && (
          <div className="mt-6 border-y border-line py-4">
            <div className="flex items-center justify-between font-body text-sm text-warmgrey">
              <span>
                ₦{formatPrice(pricePerNight)} × {totalDays}{" "}
                {totalDays === 1 ? "night" : "nights"}
              </span>
              <span className="font-heading text-2xl text-charcoal">
                ₦{formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-gold btn-block mt-6"
          disabled={loading || totalPrice === 0}
        >
          {loading ? "Sending request…" : "Request Reservation"}
        </button>

        <p className="mt-5 font-body text-xs leading-relaxed text-warmgrey">
          No payment is taken now. After your request is approved, you will
          receive payment instructions to complete your booking.
        </p>
      </form>
    </div>
  );
}

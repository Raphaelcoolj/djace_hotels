"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

export default function BookingForm({ roomId, pricePerNight }: { roomId: string, pricePerNight: number }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let totalDays = 0;
  if (checkIn && checkOut) {
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
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
        toast.success("Booking request sent successfully!");
        setCheckIn("");
        setCheckOut("");
        router.refresh();
      }
    } catch (e) {
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-8 lg:p-12 sticky top-8">
      <h2 className="text-2xl font-headline tracking-widest text-white mb-2 uppercase">Reserve this Room</h2>
      <p className="text-sm text-text-muted mb-8">Enter your dates to check availability and book.</p>
      
      {error && (
        <div className="bg-red-900/20 text-red-400 p-4 mb-6 text-sm text-center rounded border border-red-900/50">
          {error}
        </div>
      )}

      <form action={handleSubmit}>
        <input type="hidden" name="roomId" value={roomId} />
        <input type="hidden" name="totalPrice" value={totalPrice} />
        
        <div className="input-group">
          <label className="input-label">Check-In Date</label>
          <input 
            type="date" 
            name="checkInDate" 
            className="input-field bg-background/50" 
            required 
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">Check-Out Date</label>
          <input 
            type="date" 
            name="checkOutDate" 
            className="input-field bg-background/50" 
            required 
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        {totalPrice > 0 && (
          <div className="flex justify-between items-center py-4 mb-6 border-y border-outline-ghost">
            <span className="text-text-main font-semibold">Total for {totalDays} night(s)</span>
            <span className="text-xl text-accent-gold font-headline">₦{formatPrice(totalPrice)}</span>
          </div>
        )}
        
        <button type="submit" className="btn btn-gold w-full" disabled={loading || totalPrice === 0}>
          {loading ? "Processing..." : "Request Reservation"}
        </button>
      </form>
    </div>
  );
}

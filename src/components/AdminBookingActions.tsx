"use client";

import { updateBookingStatus } from "@/lib/adminActions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminBookingActions({ bookingId }: { bookingId: string }) {
  const router = useRouter();

  async function handleStatusUpdate(status: string) {
    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("status", status);
    
    try {
      await updateBookingStatus(formData);
      toast.success(`Booking ${status.replace(/_/g, ' ')} successfully!`);
      router.refresh();
    } catch {
      toast.error("Failed to update booking status.");
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleStatusUpdate("approved_awaiting_payment")}
        className="border border-gold bg-gold px-3.5 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal transition-colors duration-300 hover:bg-gold/85 cursor-pointer"
      >
        Approve
      </button>
      <button
        onClick={() => handleStatusUpdate("declined")}
        className="border border-line px-3.5 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-warmgrey transition-colors duration-300 hover:border-danger hover:text-danger cursor-pointer"
      >
        Decline
      </button>
    </div>
  );
}

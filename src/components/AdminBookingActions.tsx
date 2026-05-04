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
    } catch (e) {
      toast.error("Failed to update booking status.");
    }
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleStatusUpdate("approved_awaiting_payment")}
        className="bg-accent-gold text-primary hover:bg-accent-gold-hover px-3 py-1 text-xs font-semibold uppercase rounded transition-colors cursor-pointer"
      >
        Approve
      </button>
      <button 
        onClick={() => handleStatusUpdate("declined")}
        className="bg-transparent border border-text-muted text-text-muted hover:bg-surface-dim px-3 py-1 text-xs font-semibold uppercase rounded transition-colors cursor-pointer"
      >
        Decline
      </button>
    </div>
  );
}

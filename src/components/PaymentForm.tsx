"use client";

import { processPayment } from "@/lib/paymentAction";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PaymentForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      const res = await processPayment(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Payment confirmed! Your receipt is ready.");
        router.refresh();
      }
    } catch (e) {
      toast.error("Failed to process payment.");
    }
  }

  return (
    <form action={handleSubmit} className="mt-2">
      <input type="hidden" name="bookingId" value={bookingId} />
      <div className="flex flex-col gap-2 mb-2">
        <select name="paymentMethod" required className="input-field p-2 text-sm bg-background/50">
          <option value="">Select Payment Method</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="ussd">USSD</option>
          <option value="pos_atm">POS / ATM</option>
        </select>
        <input 
          type="text" 
          name="paymentReference" 
          placeholder="Transaction Ref / Session ID" 
          required 
          className="input-field p-2 text-sm bg-background/50"
        />
      </div>
      <button type="submit" className="btn btn-gold w-full py-2 text-xs">Confirm Payment</button>
    </form>
  );
}

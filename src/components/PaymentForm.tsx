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
    } catch {
      toast.error("Failed to process payment.");
    }
  }

  return (
    <form action={handleSubmit} className="mt-5 border-t border-line pt-5">
      <input type="hidden" name="bookingId" value={bookingId} />
      <p className="input-label">Payment method</p>
      <select name="paymentMethod" required className="input-field mb-4">
        <option value="">Select payment method</option>
        <option value="bank_transfer">Bank transfer</option>
        <option value="ussd">USSD</option>
        <option value="pos_atm">POS / ATM</option>
      </select>
      <label className="input-label" htmlFor={`pay-ref-${bookingId}`}>
        Transaction reference
      </label>
      <input
        id={`pay-ref-${bookingId}`}
        type="text"
        name="paymentReference"
        placeholder="Transaction ref / session ID"
        required
        className="input-field"
      />
      <button type="submit" className="btn btn-gold btn-block mt-4">
        Confirm Payment
      </button>
      <p className="mt-3 font-body text-[11px] leading-relaxed text-warmgrey">
        Your payment is reviewed by our team before your reservation is marked
        as confirmed.
      </p>
    </form>
  );
}

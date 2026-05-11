"use server";

import connectDB from "./db";
import Booking from "@/models/Booking";
import { revalidatePath } from "next/cache";

export async function processPayment(formData: FormData) {
  const bookingId = formData.get("bookingId") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  const paymentReference = formData.get("paymentReference") as string;

  if (!bookingId || !paymentMethod || !paymentReference) {
    return { error: "Please provide payment method and reference code" };
  }

  try {
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "paid_confirmed", paymentMethod, paymentReference },
      { new: true }
    ).populate("user room");

    if (!booking) return { error: "Booking not found" };

    // Send payment confirmation email to user
    try {
      const { sendEmail } = await import("./email");
      const user = booking.user as any;
      const room = booking.room as any;
      
      const { formatPrice } = await import("./format");
      
      await sendEmail({
        to: user.email,
        subject: "Payment Confirmed - Luxury Hotel",
        html: `<p>Hello ${user.name},</p>
               <p>Your payment of ₦${formatPrice(booking.totalPrice)} has been confirmed for your stay at ${room.name}.</p>
               <p>We look forward to hosting you!</p>`,
      });
    } catch (e) {
      console.error("Failed to send user email:", e);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    return { error: "Failed to process payment" };
  }
}

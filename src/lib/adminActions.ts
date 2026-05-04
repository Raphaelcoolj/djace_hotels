"use server";

import connectDB from "./db";
import SiteSetting from "@/models/SiteSetting";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./cloudinary";
import User from "@/models/User";

export async function updateHeroImage(formData: FormData) {
  const file = formData.get("heroImage") as File;
  if (!file || file.size === 0) return { error: "Please select an image" };

  try {
    const imageUrl = await uploadImage(file);
    await connectDB();
    await SiteSetting.findOneAndUpdate(
      { key: "hero_image" },
      { value: imageUrl },
      { upsert: true }
    );
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update hero image" };
  }
}

export async function createRoom(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const pricePerNight = Number(formData.get("pricePerNight"));
  const capacity = Number(formData.get("capacity"));
  const roomClass = formData.get("roomClass") as string;
  const imageFile = formData.get("image") as File;

  if (!name || !description || !pricePerNight) {
    return { error: "Please fill all required fields" };
  }

  try {
    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    await connectDB();
    const Room = await import("@/models/Room").then(m => m.default);
    const newRoom = new Room({
      name,
      description,
      pricePerNight,
      capacity,
      roomClass,
      images: imageUrl ? [imageUrl] : [],
    });
    await newRoom.save();
    revalidatePath("/admin");
    revalidatePath("/rooms");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create room" };
  }
}

export async function updateSiteSettings(formData: FormData) {
  const adminEmail = formData.get("adminEmail") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const bankName = formData.get("bankName") as string;
  const accountNumber = formData.get("accountNumber") as string;
  const accountName = formData.get("accountName") as string;
  const billingAddress = formData.get("billingAddress") as string;

  try {
    await connectDB();
    const settings = [
      { key: "admin_email", value: adminEmail },
      { key: "contact_phone", value: contactPhone },
      { key: "contact_email", value: contactEmail },
      { key: "bank_name", value: bankName },
      { key: "account_number", value: accountNumber },
      { key: "account_name", value: accountName },
      { key: "billing_address", value: billingAddress },
    ];

    for (const setting of settings) {
      if (setting.value !== null) {
        await SiteSetting.findOneAndUpdate(
          { key: setting.key },
          { value: setting.value },
          { upsert: true }
        );
      }
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update settings" };
  }
}

export async function updateBookingStatus(formData: FormData) {
  const bookingId = formData.get("bookingId") as string;
  const status = formData.get("status") as string;

  try {
    await connectDB();
    const Booking = await import("@/models/Booking").then(m => m.default);
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true }).populate("user");

    if (booking && booking.user?.email) {
      // Send email notification to user
      try {
        const { sendEmail } = await import("./email");
        let subject = "Booking Update - Djace Hotels";
        let html = "";

        if (status === "approved_awaiting_payment") {
          subject = "Booking Approved! - Djace Hotels";
          html = `<p>Hi ${booking.user.name},</p>
                  <p>Your booking for the room has been approved!</p>
                  <p>Please log in to your dashboard to complete the payment and confirm your stay.</p>`;
        } else if (status === "declined") {
          subject = "Booking Declined - Djace Hotels";
          html = `<p>Hi ${booking.user.name},</p>
                  <p>We're sorry, but your booking request has been declined.</p>
                  <p>Please contact us if you have any questions.</p>`;
        }

        if (html) {
          await sendEmail({
            to: booking.user.email,
            subject,
            html,
          });
        }
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
      }
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update booking status" };
  }
}

export async function promoteToAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required" };

  try {
    await connectDB();
    const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
    if (!user) return { error: "User not found" };

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to promote user" };
  }
}

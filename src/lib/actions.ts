"use server";

import connectDB from "./db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { signIn } from "../../auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Please fill in all fields" };
  }

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { error: "Email is already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return { success: true };
  } catch (error) {
    return { error: "An error occurred during registration." };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function createBooking(formData: FormData) {
  const roomId = formData.get("roomId") as string;
  const checkInDate = formData.get("checkInDate") as string;
  const checkOutDate = formData.get("checkOutDate") as string;
  
  if (!roomId || !checkInDate || !checkOutDate) {
    return { error: "Please fill in all dates" };
  }

  try {
    const session = await import("../../auth").then(m => m.auth());
    if (!session?.user?.id) {
      return { error: "You must be logged in to book a room" };
    }

    await connectDB();
    const Room = await import("@/models/Room").then(m => m.default);
    const room = await Room.findById(roomId);

    if (!room) return { error: "Room not found" };

    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    
    const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const totalPrice = diffDays * room.pricePerNight;

    const Booking = await import("@/models/Booking").then(m => m.default);
    const newBooking = new Booking({
      user: session.user.id,
      room: roomId,
      checkInDate: inDate,
      checkOutDate: outDate,
      totalPrice,
      status: "pending_approval"
    });

    await newBooking.save();
    
    try {
      const { sendEmail } = await import("./email");
      const SiteSetting = await import("@/models/SiteSetting").then(m => m.default);
      const adminEmailSetting = await SiteSetting.findOne({ key: "admin_email" });
      const adminEmail = adminEmailSetting?.value || process.env.SMTP_USER;
      
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: "New Booking Received - Luxury Hotel",
          html: `<p>A new booking has been made by ${session.user.name} (${session.user.email}).</p>
                 <p>Room: ${room.name}</p>
                 <p>Dates: ${inDate.toLocaleDateString()} to ${outDate.toLocaleDateString()}</p>`,
        });
      }
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "An error occurred while booking" };
  }
}

export async function submitFeedback(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const rating = Number(formData.get("rating"));

  if (!name || !email || !message) {
    return { error: "Please provide your name, email, and a message" };
  }

  try {
    await connectDB();
    const Feedback = await import("@/models/Feedback").then(m => m.default);
    const session = await import("../../auth").then(m => m.auth());
    
    const newFeedback = new Feedback({
      name,
      email,
      message,
      rating: rating || undefined,
      user: session?.user?.id ? session.user.id : undefined
    });

    await newFeedback.save();
    return { success: true };
  } catch (error) {
    return { error: "Failed to submit feedback." };
  }
}

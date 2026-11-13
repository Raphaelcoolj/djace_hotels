"use client";

import { useState } from "react";
import {
  updateHeroImage,
  createRoom,
  updateSiteSettings,
  promoteToAdmin,
  deleteRoom,
  toggleRoomAvailability,
  updateRoom,
} from "@/lib/adminActions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type AdminRoom = {
  _id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  roomClass?: string;
  amenities?: string[];
  images?: string[];
  isAvailable: boolean;
};

export function HeroImageForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await updateHeroImage(formData);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Hero image updated successfully!");
        router.refresh();
      }
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="border-b border-line pb-8">
      <h3 className="font-heading text-lg text-charcoal">Hero image</h3>
      <p className="mt-1.5 font-body text-xs leading-relaxed text-warmgrey">
        Displayed full-screen at the top of the homepage.
      </p>
      <div className="input-group mt-5 mb-4">
        <label className="input-label" htmlFor="hero-image">
          Photograph
        </label>
        <input
          id="hero-image"
          type="file"
          name="heroImage"
          className="input-field"
          accept="image/*"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Uploading…" : "Upload hero image"}
      </button>
    </form>
  );
}

type Settings = {
  adminEmail?: string;
  contactPhone?: string;
  contactEmail?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  billingAddress?: string;
  socialInstagram?: string;
  socialFacebook?: string;
};

export function SiteSettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await updateSiteSettings(formData);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Settings updated successfully!");
        router.refresh();
      }
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <h3 className="mt-8 font-heading text-lg text-charcoal">Contact &amp; notifications</h3>
      <div className="input-group mt-4">
        <label className="input-label" htmlFor="set-admin-email">
          Admin email (booking notifications)
        </label>
        <input
          id="set-admin-email"
          type="email"
          name="adminEmail"
          className="input-field"
          defaultValue={settings.adminEmail || ""}
        />
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="set-phone">
          Public contact phone
        </label>
        <input
          id="set-phone"
          type="text"
          name="contactPhone"
          className="input-field"
          defaultValue={settings.contactPhone || ""}
        />
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="set-email">
          Public contact email
        </label>
        <input
          id="set-email"
          type="email"
          name="contactEmail"
          className="input-field"
          defaultValue={settings.contactEmail || ""}
        />
      </div>

      <h3 className="mt-8 border-t border-line pt-8 font-heading text-lg text-charcoal">
        Social links
      </h3>
      <p className="mt-1.5 font-body text-xs text-warmgrey">
        Shown in the footer when set.
      </p>
      <div className="input-group mt-4">
        <label className="input-label" htmlFor="set-instagram">
          Instagram URL
        </label>
        <input
          id="set-instagram"
          type="url"
          name="socialInstagram"
          className="input-field"
          placeholder="https://instagram.com/…"
          defaultValue={settings.socialInstagram || ""}
        />
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="set-facebook">
          Facebook URL
        </label>
        <input
          id="set-facebook"
          type="url"
          name="socialFacebook"
          className="input-field"
          placeholder="https://facebook.com/…"
          defaultValue={settings.socialFacebook || ""}
        />
      </div>

      <h3 className="mt-8 border-t border-line pt-8 font-heading text-lg text-charcoal">
        Bank details
      </h3>
      <p className="mt-1.5 font-body text-xs text-warmgrey">
        Shown to guests when a reservation is approved for payment.
      </p>
      <div className="input-group mt-4">
        <label className="input-label" htmlFor="set-bank">
          Bank name
        </label>
        <input
          id="set-bank"
          type="text"
          name="bankName"
          className="input-field"
          defaultValue={settings.bankName || ""}
        />
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="set-account-number">
          Account number
        </label>
        <input
          id="set-account-number"
          type="text"
          name="accountNumber"
          className="input-field"
          defaultValue={settings.accountNumber || ""}
        />
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="set-account-name">
          Account name
        </label>
        <input
          id="set-account-name"
          type="text"
          name="accountName"
          className="input-field"
          defaultValue={settings.accountName || ""}
        />
      </div>

      <h3 className="mt-8 border-t border-line pt-8 font-heading text-lg text-charcoal">
        Address
      </h3>
      <div className="input-group mt-4">
        <label className="input-label" htmlFor="set-address">
          Physical address
        </label>
        <textarea
          id="set-address"
          name="billingAddress"
          className="input-field"
          rows={3}
          defaultValue={settings.billingAddress || ""}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Saving…" : "Update all settings"}
      </button>
    </form>
  );
}

export function CreateRoomForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await createRoom(formData);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Room created successfully!");
        router.refresh();
      }
    } catch {
      toast.error("Failed to create room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="input-group">
        <label className="input-label" htmlFor="room-name">
          Room name
        </label>
        <input id="room-name" type="text" name="name" className="input-field" required />
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="room-class">
          Room class
        </label>
        <input
          id="room-class"
          type="text"
          name="roomClass"
          className="input-field"
          placeholder="Standard, Suite, Penthouse…"
        />
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="room-description">
          Description
        </label>
        <textarea
          id="room-description"
          name="description"
          className="input-field"
          rows={3}
          required
        />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="input-label" htmlFor="room-price">
            Price per night (₦)
          </label>
          <input
            id="room-price"
            type="number"
            name="pricePerNight"
            className="input-field"
            min={0}
            required
          />
        </div>
        <div>
          <label className="input-label" htmlFor="room-capacity">
            Capacity (guests)
          </label>
          <input
            id="room-capacity"
            type="number"
            name="capacity"
            className="input-field"
            min={1}
            defaultValue={2}
            required
          />
        </div>
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="room-amenities">
          Amenities
        </label>
        <input
          id="room-amenities"
          type="text"
          name="amenities"
          className="input-field"
          placeholder="Wi-Fi, Air Conditioning, King Bed…"
        />
        <p className="mt-1.5 font-body text-[11px] text-warmgrey">
          Comma-separated. Shown to guests and on the homepage experiences
          section.
        </p>
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="room-image">
          Room photograph
        </label>
        <input
          id="room-image"
          type="file"
          name="image"
          className="input-field"
          accept="image/*"
        />
      </div>
      <button type="submit" className="btn btn-gold btn-block" disabled={loading}>
        {loading ? "Creating…" : "Create room"}
      </button>
    </form>
  );
}

export function AdminPromotionForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await promoteToAdmin(formData);
      if (res?.error) toast.error(res.error);
      else toast.success("User promoted to admin!");
    } catch {
      toast.error("Failed to promote user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="input-group">
        <label className="input-label" htmlFor="promote-email">
          User email
        </label>
        <input
          id="promote-email"
          type="email"
          name="email"
          className="input-field"
          required
          placeholder="user@example.com"
        />
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Processing…" : "Grant admin access"}
      </button>
    </form>
  );
}

export function RoomManagementActions({ room }: { room: AdminRoom }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const roomId = room._id.toString();
  const isAvailable = room.isAvailable;

  async function handleToggle() {
    setLoading(true);
    const formData = new FormData();
    formData.append("roomId", roomId);
    formData.append("isAvailable", isAvailable ? "true" : "false");

    try {
      const res = await toggleRoomAvailability(formData);
      if (res?.error) toast.error(res.error);
      else {
        toast.success(`Room is now ${!isAvailable ? "visible" : "hidden"}`);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this room? This cannot be undone."))
      return;

    setLoading(true);
    const formData = new FormData();
    formData.append("roomId", roomId);

    try {
      const res = await deleteRoom(formData);
      if (res?.error) toast.error(res.error);
      else toast.success("Room deleted successfully");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="border border-line px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-charcoal transition-colors duration-300 hover:border-charcoal"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className="border border-gold/40 bg-gold/10 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-gold-deep transition-colors duration-300 hover:bg-gold/20 disabled:opacity-50"
        >
          {isAvailable ? "Hide" : "Show"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="border border-danger/30 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-danger transition-colors duration-300 hover:bg-danger/10 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      {isEditing && (
        <div className="border border-line bg-cream/50 p-4">
          <h4 className="mb-4 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal">
            Edit room
          </h4>
          <EditRoomForm room={room} onSuccess={() => setIsEditing(false)} />
        </div>
      )}
    </div>
  );
}

export function EditRoomForm({ room, onSuccess }: { room: AdminRoom; onSuccess: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.append("roomId", room._id.toString());
    try {
      const res = await updateRoom(formData);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Room updated successfully!");
        router.refresh();
        onSuccess();
      }
    } catch {
      toast.error("Failed to update room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="input-label" htmlFor={`edit-name-${room._id}`}>
          Name
        </label>
        <input
          id={`edit-name-${room._id}`}
          type="text"
          name="name"
          className="input-field py-2 text-sm"
          defaultValue={room.name}
          required
        />
      </div>
      <div>
        <label className="input-label" htmlFor={`edit-desc-${room._id}`}>
          Description
        </label>
        <textarea
          id={`edit-desc-${room._id}`}
          name="description"
          className="input-field py-2 text-sm"
          rows={2}
          defaultValue={room.description}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label" htmlFor={`edit-price-${room._id}`}>
            Price (₦)
          </label>
          <input
            id={`edit-price-${room._id}`}
            type="number"
            name="pricePerNight"
            className="input-field py-2 text-sm"
            defaultValue={room.pricePerNight}
            required
          />
        </div>
        <div>
          <label className="input-label" htmlFor={`edit-capacity-${room._id}`}>
            Capacity
          </label>
          <input
            id={`edit-capacity-${room._id}`}
            type="number"
            name="capacity"
            className="input-field py-2 text-sm"
            defaultValue={room.capacity}
            required
          />
        </div>
      </div>
      <div>
        <label className="input-label" htmlFor={`edit-class-${room._id}`}>
          Class
        </label>
        <input
          id={`edit-class-${room._id}`}
          type="text"
          name="roomClass"
          className="input-field py-2 text-sm"
          defaultValue={room.roomClass || ""}
        />
      </div>
      <div>
        <label className="input-label" htmlFor={`edit-amenities-${room._id}`}>
          Amenities (comma-separated)
        </label>
        <input
          id={`edit-amenities-${room._id}`}
          type="text"
          name="amenities"
          className="input-field py-2 text-sm"
          defaultValue={(room.amenities ?? []).join(", ")}
        />
      </div>
      <div>
        <label className="input-label" htmlFor={`edit-image-${room._id}`}>
          Replace photograph
        </label>
        <input
          id={`edit-image-${room._id}`}
          type="file"
          name="image"
          className="input-field py-1.5 text-sm"
          accept="image/*"
        />
      </div>
      <button type="submit" className="btn btn-gold btn-sm" disabled={loading}>
        {loading ? "Saving…" : "Update room"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { updateHeroImage, createRoom, updateSiteSettings, promoteToAdmin, deleteRoom, toggleRoomAvailability, updateRoom } from "@/lib/adminActions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
    } catch (e) {
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="mb-8 border-b border-outline-ghost pb-8">
      <div className="input-group">
        <label className="input-label">Hero Image File</label>
        <input type="file" name="heroImage" className="input-field" accept="image/*" required />
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Uploading..." : "Upload Hero Image"}
      </button>
    </form>
  );
}

export function SiteSettingsForm({ settings }: { settings: any }) {
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
    } catch (e) {
      toast.error("Failed to update settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="input-group">
        <label className="input-label">Admin Email (For Notifications)</label>
        <input type="email" name="adminEmail" className="input-field" defaultValue={settings.adminEmail || ""} />
      </div>
      <div className="input-group">
        <label className="input-label">Public Contact Phone</label>
        <input type="text" name="contactPhone" className="input-field" defaultValue={settings.contactPhone || ""} />
      </div>
      <div className="input-group">
        <label className="input-label">Public Contact Email</label>
        <input type="email" name="contactEmail" className="input-field" defaultValue={settings.contactEmail || ""} />
      </div>
      
      <h3 className="text-lg font-headline tracking-widest text-text-main mt-8 mb-4 uppercase">Bank Details</h3>
      <div className="input-group">
        <label className="input-label">Bank Name</label>
        <input type="text" name="bankName" className="input-field" defaultValue={settings.bankName || ""} />
      </div>
      <div className="input-group">
        <label className="input-label">Account Number</label>
        <input type="text" name="accountNumber" className="input-field" defaultValue={settings.accountNumber || ""} />
      </div>
      <div className="input-group">
        <label className="input-label">Account Name</label>
        <input type="text" name="accountName" className="input-field" defaultValue={settings.accountName || ""} />
      </div>

      <h3 className="text-lg font-headline tracking-widest text-text-main mt-8 mb-4 uppercase">Billing Address</h3>
      <div className="input-group">
        <label className="input-label">Physical Address</label>
        <textarea name="billingAddress" className="input-field" rows={3} defaultValue={settings.billingAddress || ""} />
      </div>
      <button type="submit" className="btn btn-outline w-full mt-4" disabled={loading}>
        {loading ? "Saving..." : "Update All Settings"}
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
    } catch (e) {
      toast.error("Failed to create room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="input-group">
        <label className="input-label">Room Name</label>
        <input type="text" name="name" className="input-field" required />
      </div>
      <div className="input-group">
        <label className="input-label">Room Class (e.g. Suite)</label>
        <input type="text" name="roomClass" className="input-field" placeholder="Standard, Suite, Penthouse..." />
      </div>
      <div className="input-group">
        <label className="input-label">Description</label>
        <textarea name="description" className="input-field" rows={3} required></textarea>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="input-label">Price per Night (₦)</label>
          <input type="number" name="pricePerNight" className="input-field" required />
        </div>
        <div className="flex-1">
          <label className="input-label">Capacity (Persons)</label>
          <input type="number" name="capacity" className="input-field" required />
        </div>
      </div>
      <div className="input-group">
        <label className="input-label">Room Image File</label>
        <input type="file" name="image" className="input-field" accept="image/*" />
      </div>
      <button type="submit" className="btn btn-gold w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Room"}
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
      else toast.success("User promoted to Admin!");
    } catch (e) {
      toast.error("Failed to promote user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="input-group">
        <label className="input-label">User Email</label>
        <input type="email" name="email" className="input-field" required placeholder="user@example.com" />
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Processing..." : "Make Admin"}
      </button>
    </form>
  );
}

export function RoomManagementActions({ room }: { room: any }) {
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
        toast.success(`Room is now ${!isAvailable ? 'Visible' : 'Hidden'}`);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this room? This cannot be undone.")) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append("roomId", roomId);
    
    try {
      const res = await deleteRoom(formData);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Room deleted successfully");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 text-[10px] bg-blue-900/20 text-blue-400 border border-blue-900/30 rounded uppercase tracking-tighter"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        <button 
          onClick={handleToggle}
          disabled={loading}
          className={`px-3 py-1 text-[10px] rounded uppercase tracking-tighter transition-colors ${
            isAvailable ? 'bg-orange-900/20 text-orange-400 border border-orange-900/30' : 'bg-green-900/20 text-green-400 border border-green-900/30'
          }`}
        >
          {isAvailable ? "Hide" : "Show"}
        </button>
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1 text-[10px] bg-red-900/20 text-red-400 border border-red-900/30 rounded uppercase tracking-tighter hover:bg-red-900/40"
        >
          Delete
        </button>
      </div>

      {isEditing && (
        <div className="bg-surface-dim p-4 border border-outline-ghost rounded mt-2 text-left min-w-[300px]">
          <h4 className="text-xs font-bold uppercase tracking-widest text-text-main mb-4">Edit Room: {room.name}</h4>
          <EditRoomForm room={room} onSuccess={() => setIsEditing(false)} />
        </div>
      )}
    </div>
  );
}

export function EditRoomForm({ room, onSuccess }: { room: any, onSuccess: () => void }) {
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
    } catch (e) {
      toast.error("Failed to update room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3">
      <div className="input-group mb-0">
        <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1 block">Room Name</label>
        <input type="text" name="name" className="input-field py-1 text-sm" defaultValue={room.name} required />
      </div>
      <div className="input-group mb-0">
        <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1 block">Description</label>
        <textarea name="description" className="input-field py-1 text-sm" rows={2} defaultValue={room.description} required></textarea>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1 block">Price (₦)</label>
          <input type="number" name="pricePerNight" className="input-field py-1 text-sm" defaultValue={room.pricePerNight} required />
        </div>
        <div className="flex-1">
          <label className="text-[10px] uppercase tracking-widest text-text-muted mb-1 block">Capacity</label>
          <input type="number" name="capacity" className="input-field py-1 text-sm" defaultValue={room.capacity} required />
        </div>
      </div>
      <button type="submit" className="btn btn-gold py-2 text-xs" disabled={loading}>
        {loading ? "Updating..." : "Update Details"}
      </button>
    </form>
  );
}



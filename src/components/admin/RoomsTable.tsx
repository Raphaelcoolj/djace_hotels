"use client";

import { Fragment, useState } from "react";
import {
  RoomManagementActions,
  EditRoomForm,
  type AdminRoom,
} from "@/components/AdminForms";
import { formatPrice } from "@/lib/format";

export default function RoomsTable({ rooms }: { rooms: AdminRoom[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey sm:px-6">
              Room
            </th>
            <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
              Class
            </th>
            <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
              Price / night
            </th>
            <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
              Capacity
            </th>
            <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
              Status
            </th>
            <th className="px-5 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-warmgrey">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            const id = room._id.toString();
            const isEditing = editingId === id;
            return (
              <Fragment key={id}>
                <tr className="border-b border-line/70 transition-colors hover:bg-cream/60">
                  <td className="px-5 py-4 sm:px-6">
                    <div className="font-body text-sm font-medium text-charcoal">
                      {room.name}
                    </div>
                    <div className="mt-0.5 font-body text-xs text-warmgrey">
                      {(room.amenities ?? []).length} amenities
                    </div>
                  </td>
                  <td className="px-5 py-4 font-body text-sm text-warmgrey">
                    {room.roomClass || "—"}
                  </td>
                  <td className="px-5 py-4 font-heading text-lg text-charcoal">
                    ₦{formatPrice(room.pricePerNight)}
                  </td>
                  <td className="px-5 py-4 font-body text-sm text-warmgrey">
                    {room.capacity} guests
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 font-body text-[10px] font-medium uppercase tracking-[0.16em] ${
                        room.isAvailable
                          ? "bg-forest/10 text-forest border border-forest/30"
                          : "bg-cream text-warmgrey border border-line"
                      }`}
                    >
                      {room.isAvailable ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <RoomManagementActions
                      room={room}
                      isEditing={isEditing}
                      onToggleEdit={() => setEditingId(isEditing ? null : id)}
                    />
                  </td>
                </tr>
                {isEditing && (
                  <tr className="border-b border-line/70 bg-cream/50">
                    <td colSpan={6} className="px-5 py-5 sm:px-6">
                      <div className="max-w-2xl border border-line bg-ivory p-4">
                        <h4 className="mb-4 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal">
                          Edit room
                        </h4>
                        <EditRoomForm
                          room={room}
                          onSuccess={() => setEditingId(null)}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
          {rooms.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-10 text-center font-body text-sm text-warmgrey"
              >
                No rooms added yet — create one from the panel.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

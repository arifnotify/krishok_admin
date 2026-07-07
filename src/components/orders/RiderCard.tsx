"use client";

import { Truck, UserCheck } from "lucide-react";

interface Props {
  riders: any[];
  selectedRider: string;
  setSelectedRider: (value: string) => void;
  assign: () => void;
  locked: boolean;
}

export default function RiderCard({
  riders,
  selectedRider,
  setSelectedRider,
  assign,
  locked,
}: Props) {
  return (
    <div
      className={`
        bg-white border rounded-2xl p-5 shadow-sm
        ${locked ? "opacity-70" : ""}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold">Assign Rider</h2>

        {locked && (
          <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
            Locked
          </span>
        )}
      </div>

      {/* SELECT RIDER */}
      <div className="space-y-2">
        <label className="text-sm text-gray-600">
          Select Delivery Rider
        </label>

        <select
          disabled={locked}
          value={selectedRider}
          onChange={(e) => setSelectedRider(e.target.value)}
          className="
            w-full border rounded-xl px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
          "
        >
          <option value="">Choose rider</option>

          {riders.map((rider: any) => (
            <option key={rider._id} value={rider._id}>
              {rider.name}
            </option>
          ))}
        </select>
      </div>

      {/* BUTTON */}
      <button
        onClick={assign}
        disabled={locked || !selectedRider}
        className={`
          w-full mt-4 flex items-center justify-center gap-2
          py-3 rounded-xl font-semibold text-white transition

          ${
            locked || !selectedRider
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
          }
        `}
      >
        <UserCheck className="w-4 h-4" />
        Assign Rider
      </button>

      {/* INFO BOX */}
      <div className="mt-4 text-xs text-gray-500">
        {locked
          ? "This order is locked (Delivered/Cancelled)."
          : "You can assign a rider before delivery starts."}
      </div>
    </div>
  );
}
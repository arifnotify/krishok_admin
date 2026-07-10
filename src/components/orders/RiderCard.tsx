"use client";

import {
  Truck,
  UserCheck,
} from "lucide-react";

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
  const handleAssign = () => {
    if (locked || !selectedRider) return;

    const rider = riders.find(
      (r: any) => r._id === selectedRider
    );

    const riderName = rider?.name || "Unknown Rider";

    const confirmed = window.confirm(
      `Selected Rider: ${riderName}

Are you sure you want to assign this rider to the order?`
    );

    if (confirmed) {
      assign();
    }
  };

  return (
    <div
      className={`
        bg-white
        border
        rounded-xl
        p-5
        h-full
        ${locked ? "opacity-60" : ""}
      `}
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          gap-2
          mb-5
        "
      >
        <Truck
          size={20}
          className="text-blue-600"
        />

        <h2
          className="
            font-bold
            text-gray-800
          "
        >
          Delivery Rider
        </h2>
      </div>

      {/* Select Rider */}
      <label
        className="
          text-sm
          text-gray-600
        "
      >
        Select Rider
      </label>

      <select
        disabled={locked}
        value={selectedRider}
        onChange={(e) =>
          setSelectedRider(e.target.value)
        }
        className="
          w-full
          mt-2
          border
          rounded-lg
          px-3
          py-3
          outline-none
          disabled:bg-gray-100
        "
      >
        <option value="">
          Choose Rider
        </option>

        {riders.map((rider: any) => (
          <option
            key={rider._id}
            value={rider._id}
          >
            {rider.name}
          </option>
        ))}
      </select>

      {/* Assign Button */}
      <button
        onClick={handleAssign}
        disabled={
          locked ||
          !selectedRider
        }
        className={`
          mt-5
          w-full
          py-3
          rounded-lg
          font-semibold
          flex
          items-center
          justify-center
          gap-2
          text-white
          transition-colors

          ${
            locked || !selectedRider
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }
        `}
      >
        <UserCheck size={17} />
        Assign Rider
      </button>

      {/* Info */}
      <p
        className="
          text-xs
          text-gray-500
          mt-4
        "
      >
        {locked
          ? "Order completed. Rider cannot be changed."
          : "Assign rider before delivery."}
      </p>
    </div>
  );
}

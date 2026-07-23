"use client";

import { Order } from "@/src/types/order";
import { CheckCircle, Lock } from "lucide-react";

interface Props {
  order: Order;
  onChange: (status: string) => void;
}

export default function StatusCard({ order, onChange }: Props) {
  const currentRawStatus = order?.orderStatus?.toUpperCase() || "";

  // 🔴 NORMALIZING STATUS FOR DROPDOWN VALUE MATCHING
  const getNormalizedStatus = (status: string) => {
    if (status === "OUTFORDELIVERY" || status === "OUT_FOR_DELIVERY") {
      return "OUT_FOR_DELIVERY";
    }
    return status;
  };

  const selectedValue = getNormalizedStatus(currentRawStatus);

  // 🔴 CASE-INSENSITIVE LOCK CHECK
  const isLocked =
    currentRawStatus === "DELIVERED" || currentRawStatus === "CANCELLED";

  // 🔴 STATUS STYLES
  const statusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "PROCESSING":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-700 border-purple-200";

      case "DELIVERED":
        return "bg-green-100 text-green-700 border-green-200";

      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // 🔴 DISPLAY TEXT FORMATTER
  const formatStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "PROCESSING":
        return "Processing";
      case "OUT_FOR_DELIVERY":
        return "Out For Delivery";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (isLocked) return;

    const newStatus = e.target.value;
    if (newStatus === selectedValue) return;

    const confirmed = window.confirm(
      `Are you sure you want to change order status to "${formatStatusText(newStatus)}"?`
    );

    if (confirmed) {
      onChange(newStatus);
    } else {
      e.target.value = selectedValue;
    }
  };

  return (
    <div className="bg-white border rounded-xl p-5 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CheckCircle size={20} className="text-blue-600" />
          <h2 className="font-bold text-gray-800">Order Status</h2>
        </div>

        {isLocked && (
          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-full border border-red-200">
            <Lock size={12} /> Locked
          </span>
        )}
      </div>

      {/* CURRENT STATUS BADGE */}
      <div className="mb-5">
        <p className="text-xs text-gray-500 mb-2">Current Status</p>
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold border ${statusStyle(
            selectedValue
          )}`}
        >
          {formatStatusText(selectedValue)}
        </span>
      </div>

      {/* UPDATE STATUS DROPDOWN */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Update Status
        </label>

        <select
          disabled={isLocked}
          value={selectedValue}
          onChange={handleStatusChange}
          className={`w-full border rounded-lg px-3 py-3 outline-none text-sm font-medium transition-all ${
            isLocked
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-gray-800 border-gray-300 hover:border-blue-400 focus:border-blue-500 cursor-pointer"
          }`}
        >
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>
  );
}

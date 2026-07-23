"use client";

import { Order } from "@/src/types/order";
import { CheckCircle, Lock } from "lucide-react";

interface Props {
  order: Order;
  onChange: (status: string) => void;
}

export default function StatusCard({ order, onChange }: Props) {
  const currentStatusUpper = order?.orderStatus?.toUpperCase() || "";
  
  // 🔴 LOCK CHECK FOR DELIVERED OR CANCELLED
  const isLocked =
    currentStatusUpper === "DELIVERED" || currentStatusUpper === "CANCELLED";

  // STATUS STYLING
  const statusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "OUT_FOR_DELIVERY":
      case "OUTFORDELIVERY":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "DELIVERED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Pending";
      case "PROCESSING":
        return "Processing";
      case "OUT_FOR_DELIVERY":
      case "OUTFORDELIVERY":
        return "Out For Delivery";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isLocked) return;

    const newStatus = e.target.value;
    if (newStatus === order.orderStatus) return;

    const confirmed = window.confirm(
      `Are you sure you want to change order status to "${formatStatusText(newStatus)}"?`
    );

    if (confirmed) {
      onChange(newStatus);
    } else {
      e.target.value = order.orderStatus;
    }
  };

  return (
    <div className="bg-white border rounded-xl p-5 h-full flex flex-col justify-between">
      <div>
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

        {/* CURRENT STATUS */}
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-2">Current Status</p>
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold border ${statusStyle(
              order.orderStatus
            )}`}
          >
            {formatStatusText(order.orderStatus)}
          </span>
        </div>

        {/* UPDATE DROPDOWN */}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Update Status
          </label>

          <select
            disabled={isLocked}
            value={currentStatusUpper}
            onChange={handleStatusChange}
            className={`w-full border rounded-lg px-3 py-3 outline-none text-sm font-medium transition-all ${
              isLocked
                ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
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

      {/* LOCKED WARNING */}
      {isLocked && (
        <div className="mt-5 bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-start gap-2.5">
          <Lock size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-red-700">Order Locked</p>
            <p className="text-[11px] text-red-600 mt-0.5 leading-snug">
              This order has been {formatStatusText(order.orderStatus).toLowerCase()} and cannot be modified further.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

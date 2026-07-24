"use client";

import { Order } from "@/src/types/order";

interface Props {
  order: Order;
  onChange: (status: string) => void;
}

export default function StatusCard({ order, onChange }: Props) {
  // 🔴 BACKEND TO FRONTEND FORMAT MAPPER
  const formatBackendStatus = (status: string) => {
    if (!status) return "Pending";
    const upper = status.toUpperCase();
    switch (upper) {
      case "PENDING":
        return "Pending";
      case "PROCESSING":
        return "Processing";
      case "OUT_FOR_DELIVERY":
      case "OUTFORDELIVERY":
        return "OutForDelivery";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const currentStatus = formatBackendStatus(order?.orderStatus);

  const isLocked =
    currentStatus === "Delivered" || currentStatus === "Cancelled";

  const statusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "OutForDelivery":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVal = e.target.value;
    
    // ব্যাকএন্ডে পাঠানোর সময় যদি আবার বড় হাতের বা নির্দিষ্ট ফরম্যাট দরকার হয়, 
    // তবে এখানে ম্যাপিং করে দিতে পারেন। যেমন: "OUT_FOR_DELIVERY" বা হুবহু পাঠাতে পারেন।
    let backendVal = selectedVal;
    if (selectedVal === "OutForDelivery") {
      backendVal = "OUT_FOR_DELIVERY"; 
    } else {
      backendVal = selectedVal.toUpperCase();
    }

    onChange(backendVal);
  };

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Order Status</h2>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(
            currentStatus
          )}`}
        >
          {currentStatus}
        </span>
      </div>

      {/* CURRENT STATUS BOX */}
      <div className="mb-4 p-3 rounded-xl bg-gray-50 border flex justify-between items-center">
        <span className="text-sm text-gray-600">Current Status</span>

        <span
          className={`text-sm font-semibold ${statusColor(
            currentStatus
          )}`}
        >
          {currentStatus}
        </span>
      </div>

      {/* SELECT */}
      <label className="text-sm font-medium text-gray-600 mb-2 block">
        Update Status
      </label>

      <select
        disabled={isLocked}
        value={currentStatus}
        onChange={handleSelectChange}
        className={`
          w-full
          border
          rounded-xl
          p-3
          outline-none
          transition
          ${
            isLocked
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white hover:border-blue-400"
          }
        `}
      >
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="OutForDelivery">Out For Delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      {/* LOCK NOTICE */}
      {isLocked && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 font-semibold text-sm">
            🔒 Order Locked
          </p>
          <p className="text-red-500 text-xs mt-1">
            Delivered or Cancelled orders cannot be modified.
          </p>
        </div>
      )}
    </div>
  );
}

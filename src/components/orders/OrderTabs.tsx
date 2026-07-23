"use client";

import { OrderStatus } from "@/src/types/order";

type TabType = OrderStatus | "All";

// 🔴 FIXED: Enum values matching OrderStatus (UPPERCASE)
const tabs: { value: TabType; label: string }[] = [
  { value: "All", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface Props {
  active: TabType;
  onChange: (value: TabType) => void;
}

export default function OrderTabs({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            active === tab.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

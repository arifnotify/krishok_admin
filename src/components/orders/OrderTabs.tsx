"use client";

import { OrderStatus } from "@/src/types/order";

type TabType = OrderStatus | "All";

// Backend Enum অনুযায়ী
const tabs: { value: TabType; label: string }[] = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "Processing",
    label: "Processing",
  },
  {
    value: "OutForDelivery",
    label: "Out For Delivery",
  },
  {
    value: "Delivered",
    label: "Delivered",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
  },
];

interface Props {
  active: TabType;
  onChange: (value: TabType) => void;
}

export default function OrderTabs({
  active,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            active === tab.value
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

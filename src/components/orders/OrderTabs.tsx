"use client";

import { OrderStatus } from "@/src/types/order";

type TabType = OrderStatus | "All";

const tabs: TabType[] = [
  "All",
  "Pending",
  "Processing",
  "OutForDelivery",
  "Delivered",
  "Cancelled",
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
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded-lg transition ${
            active === tab
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
"use client";

import { Order } from "@/src/types/order";

interface Props {
  order: Order;
}

export default function OrderTimeline({ order }: Props) {
  const steps = [
    { key: "Pending", label: "Order Placed" },
    { key: "Processing", label: "Processing" },
    { key: "OutForDelivery", label: "Out for Delivery" },
    { key: "Delivered", label: "Delivered" },
  ];

  const currentIndex = steps.findIndex(
    (s) => s.key === order.orderStatus
  );

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">

      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-bold">
          Order Timeline
        </h2>
        <p className="text-sm text-gray-500">
          Live tracking of order status
        </p>
      </div>

      {/* TIMELINE */}
      <div className="space-y-6 relative">

        {/* vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gray-200" />

        {steps.map((step, index) => {
          const active = index <= currentIndex;

          return (
            <div
              key={step.key}
              className="flex items-start gap-4 relative"
            >
              {/* dot */}
              <div
                className={`
                  w-4 h-4 rounded-full z-10 mt-1
                  ${active ? "bg-green-500" : "bg-gray-300"}
                `}
              />

              {/* content */}
              <div>
                <p className={`font-semibold ${
                  active ? "text-gray-900" : "text-gray-400"
                }`}>
                  {step.label}
                </p>

                <p className="text-xs text-gray-500">
                  {active ? "Completed / In progress" : "Waiting"}
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
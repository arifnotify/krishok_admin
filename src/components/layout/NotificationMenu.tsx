"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "order" | "system" | "warning";
};

const notifications: Notification[] = [
  {
    id: 1,
    title: "New Order Received",
    message: "Order #1024 has been placed",
    time: "2 min ago",
    type: "order",
  },
  {
    id: 2,
    title: "Payment Failed",
    message: "Transaction failed for Order #1020",
    time: "10 min ago",
    type: "warning",
  },
  {
    id: 3,
    title: "System Update",
    message: "New version deployed successfully",
    time: "1 hour ago",
    type: "system",
  },
];

export default function NotificationMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
      >
        <Bell size={20} />

        {/* Badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
          {notifications.length}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl border rounded-xl overflow-hidden z-50">

          {/* Header */}
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800">
              Notifications
            </h2>
            <p className="text-xs text-gray-500">
              You have {notifications.length} new alerts
            </p>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">

            {notifications.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-gray-50 border-b cursor-pointer"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <p className="font-medium text-sm text-gray-800">
                      {item.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item.message}
                    </p>

                  </div>

                  <span className="text-[10px] text-gray-400">
                    {item.time}
                  </span>

                </div>

              </div>
            ))}

          </div>

          {/* Footer */}
          <div className="p-3 text-center border-t">
            <button className="text-sm text-pink-600 hover:underline">
              View all notifications
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
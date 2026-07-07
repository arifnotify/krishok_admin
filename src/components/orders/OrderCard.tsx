"use client";

import { Order } from "@/src/types/order";
import Link from "next/link";

interface Props {
  order: Order;
}

export default function OrderCard({
  order,
}: Props) {
  const getColor = (
    status: string
  ) => {
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
        return "";
    }
  };

  return (
    <Link
      href={`/orders/${order._id}`}
    >
      <div
        className="
        border
        rounded-xl
        p-4
        bg-white
        hover:shadow-md
        transition
        cursor-pointer
        "
      >
        <div className="flex justify-between">

          <h3 className="font-bold">
            #{order.orderNumber}
          </h3>

          <span
            className={`
            px-2 py-1 rounded-full text-xs
            ${getColor(
              order.orderStatus
            )}
          `}
          >
            {order.orderStatus}
          </span>

        </div>

        <p className="text-sm text-gray-500 mt-2">
          {order.customerPhone}
        </p>

        <p className="font-semibold mt-2">
          ৳{order.totalAmount}
        </p>

        <p className="text-xs text-gray-400 mt-2">
          {new Date(
            order.createdAt
          ).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
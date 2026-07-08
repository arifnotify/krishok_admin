"use client";

import { Order } from "@/src/types/order";

interface Props {
  activeOrders: Order[];
  completedOrders: Order[];

  selectedId?: string;

  onSelect: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-700";

    case "Processing":
      return "bg-blue-100 text-blue-700";

    case "OutForDelivery":
      return "bg-purple-100 text-purple-700";

    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function OrdersSidebar({
  activeOrders,
  completedOrders,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="h-[calc(100vh-220px)] flex flex-col">

      {/* ======================
          HEADER
      ====================== */}

      <div className="sticky top-0 bg-white z-20 border-b p-5">

        <h2 className="text-2xl font-bold text-slate-900">
          Orders
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {activeOrders.length} Active •{" "}
          {completedOrders.length} Completed
        </p>

      </div>

      {/* ======================
          SCROLL AREA
      ====================== */}

      <div className="flex-1 overflow-y-auto p-4">

        {/* ACTIVE */}

        <div className="mb-8">

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-bold text-blue-600 uppercase text-sm tracking-wider">
              Active Orders
            </h3>

            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {activeOrders.length}
            </span>

          </div>

          <div className="space-y-4">

            {activeOrders.length === 0 && (
              <div className="border rounded-2xl p-6 text-center text-gray-400">
                No Active Orders
              </div>
            )}

            {activeOrders.map((order) => (
              <button
                key={order._id}
                onClick={() => onSelect(order._id)}
                className={`
                  w-full
                  text-left
                  rounded-2xl
                  border
                  p-4
                  transition-all
                  duration-200

                  ${
                    selectedId === order._id
                      ? `
                        border-pink-500
                        bg-pink-50
                        shadow-md
                      `
                      : `
                        border-slate-200
                        bg-white
                        hover:border-pink-300
                        hover:shadow-sm
                      `
                  }
                `}
              >
                {/* TOP */}

                <div className="flex justify-between items-start">

                  <div>

                    <p className="font-bold text-slate-900">
                      #{order.orderNumber}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {order.customerPhone}
                    </p>

                  </div>

                  <span
                    className={`
                      text-xs
                      px-2
                      py-1
                      rounded-full
                      ${getStatusColor(order.orderStatus)}
                    `}
                  >
                    {order.orderStatus}
                  </span>

                </div>

                {/* PRICE */}

                <div className="mt-4 flex justify-between items-center">

                  <span className="text-green-600 font-bold">
                    ৳{order.totalAmount}
                  </span>

                  <span className="text-xs text-slate-400">
                    Order
                  </span>

                </div>

              </button>
            ))}

          </div>

        </div>

        {/* COMPLETED */}

        <div>

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-bold text-green-600 uppercase text-sm tracking-wider">
              Completed Orders
            </h3>

            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {completedOrders.length}
            </span>

          </div>

          <div className="space-y-4">

            {completedOrders.length === 0 && (
              <div className="border rounded-2xl p-6 text-center text-gray-400">
                No Completed Orders
              </div>
            )}

            {completedOrders.map((order) => (
              <button
                key={order._id}
                onClick={() => onSelect(order._id)}
                className={`
                  w-full
                  text-left
                  rounded-2xl
                  border
                  p-4
                  transition-all

                  ${
                    selectedId === order._id
                      ? `
                        border-green-500
                        bg-green-50
                      `
                      : `
                        border-slate-200
                        bg-white
                        hover:border-green-300
                      `
                  }
                `}
              >
                <div className="flex justify-between items-start">

                  <div>

                    <p className="font-bold text-slate-900">
                      #{order.orderNumber}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {order.customerPhone}
                    </p>

                  </div>

                  <span
                    className={`
                      text-xs
                      px-2
                      py-1
                      rounded-full
                      ${getStatusColor(order.orderStatus)}
                    `}
                  >
                    {order.orderStatus}
                  </span>

                </div>

                <div className="mt-4 flex justify-between items-center">

                  <span className="text-green-600 font-bold">
                    ৳{order.totalAmount}
                  </span>

                  <span className="text-xs text-slate-400">
                    Completed
                  </span>

                </div>

              </button>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}
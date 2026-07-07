"use client";

import { Order } from "@/src/types/order";

interface Props {
  order: Order;
}

export default function OrderSummary({ order }: Props) {
  const total =
    order.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;

  const totalItems =
    order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const subtotal = total;
  const deliveryCharge = (order as any).deliveryCharge || 0;
  const discount = (order as any).discount || 0;

  const finalTotal = subtotal + deliveryCharge - discount;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">
          Order Summary
        </h2>

        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          {order.orderNumber}
        </span>
      </div>

      {/* CONTENT */}
      <div className="space-y-4 text-sm">

        {/* Products */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Products</span>
          <span className="font-semibold text-gray-800">
            {order.items?.length || 0}
          </span>
        </div>

        {/* Quantity */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Total Quantity</span>
          <span className="font-semibold text-gray-800">
            {totalItems}
          </span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold text-gray-800">
            ৳{subtotal}
          </span>
        </div>

        {/* Delivery */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Delivery Charge</span>
          <span className="font-semibold text-gray-800">
            ৳{deliveryCharge}
          </span>
        </div>

        {/* Discount */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Discount</span>
          <span className="font-semibold text-red-500">
            -৳{discount}
          </span>
        </div>

        <hr className="my-2" />

        {/* Payment Method */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-semibold text-gray-800">
            {order.paymentMethod}
          </span>
        </div>

        {/* Payment Status */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Payment Status</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold
              ${
                order.isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }
            `}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>

        <hr className="my-3" />

        {/* TOTAL */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-base font-bold text-gray-800">
            Total Amount
          </span>

          <span className="text-xl font-bold text-green-600">
            ৳{finalTotal}
          </span>
        </div>

      </div>
    </div>
  );
}
"use client";

import { Order } from "@/src/types/order";
import { CreditCard, Package, Truck } from "lucide-react";

interface Props {
  order: Order;
}

export default function OrderSummary({ order }: Props) {
  // টাইপ সেইফ ডাটা এক্সট্র্যাকশন
  const subTotal = order.subTotal || 0;
  const deliveryCharge = order.deliveryCharge || 0;
  const discount = order.discountAmount ?? order.rewardUsed ?? 0;
  
  // Flutter ও Admin Panel উভয় জায়গায় ম্যাচ করার জন্য finalAmount
  const finalTotal = order.finalAmount ?? (subTotal + deliveryCharge - discount);

  const totalItems = order.items?.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  ) || 0;

  return (
    <div className="bg-white border rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-5">
        <CreditCard size={20} className="text-blue-600" />
        <h2 className="font-bold text-gray-800">Payment Summary</h2>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Products</span>
          <span className="font-semibold">{order.items?.length || 0}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 flex gap-2">
            <Package size={15} /> Quantity
          </span>
          <span className="font-semibold">{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold">QAR {subTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 flex gap-2">
            <Truck size={15} /> Delivery Fee
          </span>
          <span className="font-semibold">QAR {deliveryCharge.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Discount / Reward</span>
          <span className="font-semibold text-red-500">
            -QAR {discount.toFixed(2)}
          </span>
        </div>

        <hr />

        <div className="flex justify-between">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-semibold">{order.paymentMethod}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Payment Status</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              order.isPaid
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>

        <div className="border-t pt-4 flex justify-between items-center">
          <span className="font-bold text-gray-800">Total Amount</span>
          <span className="text-xl font-bold text-green-600">
            QAR {finalTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

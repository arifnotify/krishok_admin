"use client";

import { Order } from "@/src/types/order";

type Props = {
  order: Order;
};

export default function PrintableInvoice({ order }: Props) {
  return (
    <div className="print-area p-6 bg-white">

      <h1 className="text-2xl font-bold mb-4">
        Invoice #{order.orderNumber}
      </h1>

      <p>Customer: {order.customerPhone}</p>

      <p>Status: {order.orderStatus}</p>

      <hr className="my-4" />

      {order.items.map((item, i) => (
        <div key={i} className="flex justify-between py-1">
          <span>{item.productName}</span>
          <span>{item.quantity} x {item.price}</span>
        </div>
      ))}

      <hr className="my-4" />

      <p className="font-bold">
        Total: {order.totalAmount}
      </p>

    </div>
  );
}
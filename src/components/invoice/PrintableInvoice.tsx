"use client";

import { Order } from "@/src/types/order";

type Props = {
  order: Order;
};

export default function PrintableInvoice({
  order,
}: Props) {
  const address =
    order.shippingAddress as any;

  const fullAddress = [
    address?.areaOrVillage,
    address?.landmark,
    address?.directionNote,
    address?.label
      ? `(${address.label})`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="print-area p-6 bg-white">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-4">
        Invoice #
        {order.orderNumber}
      </h1>

      {/* CUSTOMER INFO */}
      <div className="mb-4 space-y-1">
        <p>
          <strong>Name:</strong>{" "}
          {address?.fullName ||
            "N/A"}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {address?.phoneNumber ||
            order.customerPhone ||
            "N/A"}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {fullAddress || "N/A"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {order.orderStatus}
        </p>

        <p>
          <strong>Payment:</strong>{" "}
          {order.paymentMethod}
        </p>
      </div>

      <hr className="my-4" />

      {/* ITEMS */}
      {order.items.map(
        (item, i) => {
          const productNameText =
            typeof item.productName ===
              "object" &&
            item.productName !== null
              ? item.productName.en
              : item.productName;

          return (
            <div
              key={i}
              className="flex justify-between py-1"
            >
              <span>
                {productNameText}
              </span>

              <span>
                {item.quantity} ×{" "}
                {item.price}
              </span>
            </div>
          );
        }
      )}

      <hr className="my-4" />

      {/* TOTALS */}
      <div className="space-y-1">
        <p>
          Subtotal:{" "}
          {order.subTotal}
        </p>

        <p>
          Delivery Charge:{" "}
          {order.deliveryCharge}
        </p>

        {(order.discountAmount ??
          0) > 0 && (
          <p>
            Discount: -
            {
              order.discountAmount
            }
          </p>
        )}

        <p className="font-bold text-lg">
          Total:{" "}
          {order.finalAmount ??
            order.totalAmount}
        </p>
      </div>
    </div>
  );
}

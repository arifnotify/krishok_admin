"use client";

import { generateInvoice } from "@/src/utils/generateInvoice";
import { InvoiceData } from "@/src/types/invoice";

interface Props {
  order: any;
}

// ===============================
// FULL ADDRESS FORMATTER
// ===============================
const getFullAddress = (address: any) => {
  if (!address) return "N/A";

  if (typeof address === "string") {
    return address;
  }

  return [
    address.areaOrVillage,
    address.landmark,
    address.directionNote,
    address.label ? `(${address.label})` : null,
  ]
    .filter(Boolean)
    .join(", ");
};

// ===============================
// ORDER → INVOICE MAPPER
// ===============================
const buildInvoice = (
  order: any
): InvoiceData => {
  const subtotal = order.items.reduce(
    (sum: number, item: any) =>
      sum + item.totalPrice,
    0
  );

  const deliveryCharge =
    order.deliveryCharge || 0;

  const discount =
    order.discountAmount || 0;

  return {
    invoiceNumber:
      order.orderNumber,

    orderNumber:
      order.orderNumber,

    invoiceDate:
      new Date().toISOString(),

    customer: {
      name:
        order.shippingAddress
          ?.fullName ||
        "Customer",

      phone:
        order.shippingAddress
          ?.phoneNumber ||
        order.customerPhone,

      address:
        getFullAddress(
          order.shippingAddress
        ),
    },

    items: order.items,

    subtotal,

    deliveryCharge,

    discount,

    total:
      subtotal +
      deliveryCharge -
      discount,

    paymentMethod:
      order.paymentMethod,

    paymentStatus:
      order.isPaid,

    orderStatus:
      order.orderStatus,
  };
};

export default function InvoiceActions({
  order,
}: Props) {
  // ===============================
  // DOWNLOAD INVOICE
  // ===============================
  const handleDownload = () => {
    const invoice =
      buildInvoice(order);

    generateInvoice(invoice);
  };

  // ===============================
  // PRINT INVOICE
  // ===============================
  const handlePrint = () => {
    const invoice =
      buildInvoice(order);

    generateInvoice(invoice);

    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="bg-white border rounded-2xl p-4 flex gap-3">
      <button
        onClick={handleDownload}
        className="
          bg-green-600
          hover:bg-green-700
          text-white
          px-4
          py-2
          rounded-xl
          font-medium
        "
      >
        📥 Download Invoice
      </button>

      <button
        onClick={handlePrint}
        className="
          bg-gray-800
          hover:bg-black
          text-white
          px-4
          py-2
          rounded-xl
          font-medium
        "
      >
        🖨 Print
      </button>
    </div>
  );
}

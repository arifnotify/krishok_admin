"use client";

import { useRef } from "react";
import { generateInvoice } from "@/src/utils/generateInvoice";
import { InvoiceData } from "@/src/types/invoice";

interface Props {
  order: any;
}

export default function InvoiceActions({
  order,
}: Props) {
  const loadingRef = useRef(false);

  // =========================
  // FULL ADDRESS
  // =========================
  const getFullAddress = () => {
    const address = order?.shippingAddress;

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

  // =========================
  // FORMAT ORDER → INVOICE
  // =========================
  const buildInvoice = (): InvoiceData => {
    const subtotal = order.items.reduce(
      (sum: number, item: any) =>
        sum + item.totalPrice,
      0
    );

    const deliveryCharge =
      order.deliveryCharge || 0;

    const discount =
      order.discountAmount || 0;

    const total =
      subtotal +
      deliveryCharge -
      discount;

    return {
      invoiceNumber: order.orderNumber,
      orderNumber: order.orderNumber,
      invoiceDate:
        new Date().toISOString(),

      customer: {
        name:
          order.shippingAddress
            ?.fullName || "Customer",

        phone:
          order.shippingAddress
            ?.phoneNumber ||
          order.customerPhone,

        address: getFullAddress(),
      },

      items: order.items,

      subtotal,

      deliveryCharge,

      discount,

      total,

      paymentMethod:
        order.paymentMethod,

      paymentStatus:
        order.isPaid,

      orderStatus:
        order.orderStatus,
    };
  };

  // =========================
  // DOWNLOAD PDF
  // =========================
  const handleDownload = () => {
    if (loadingRef.current) return;

    loadingRef.current = true;

    generateInvoice(
      buildInvoice()
    );

    loadingRef.current = false;
  };

  // =========================
  // PRINT
  // =========================
  const handlePrint = () => {
    generateInvoice(
      buildInvoice()
    );

    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="bg-white border rounded-2xl p-4 flex gap-3">
      <button
        onClick={handleDownload}
        className="
          bg-blue-600
          text-white
          px-4
          py-2
          rounded-xl
          hover:bg-blue-700
          transition
        "
      >
        📥 Download Invoice
      </button>

      <button
        onClick={handlePrint}
        className="
          bg-gray-800
          text-white
          px-4
          py-2
          rounded-xl
          hover:bg-black
          transition
        "
      >
        🖨️ Print
      </button>
    </div>
  );
}

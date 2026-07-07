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
  // FORMAT ORDER → INVOICE
  // =========================
  const buildInvoice = (): InvoiceData => {
    const subtotal =
      order.items.reduce(
        (sum: number, item: any) =>
          sum + item.totalPrice,
        0
      );

    const deliveryCharge =
      order.deliveryCharge || 0;

    const discount =
      order.discount || 0;

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
        phone: order.customerPhone,
        address:
          `${order.shippingAddress?.areaOrVillage || ""} ${order.shippingAddress?.landmark || ""}`,
      },
      items: order.items,
      subtotal,
      deliveryCharge,
      discount,
      total,
      paymentMethod:
        order.paymentMethod,
      paymentStatus: order.isPaid,
      orderStatus: order.orderStatus,
    };
  };

  // =========================
  // DOWNLOAD PDF
  // =========================
  const handleDownload = () => {
    if (loadingRef.current) return;

    loadingRef.current = true;

    const invoice = buildInvoice();

    generateInvoice(invoice);

    loadingRef.current = false;
  };

  // =========================
  // PRINT INVOICE
  // =========================
  const handlePrint = () => {
    const invoice = buildInvoice();

    generateInvoice(invoice);

    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="bg-white border rounded-2xl p-4 flex gap-3">

      {/* DOWNLOAD */}
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

      {/* PRINT */}
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
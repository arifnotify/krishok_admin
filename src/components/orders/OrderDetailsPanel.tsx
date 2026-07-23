"use client";

import CustomerInfoCard from "./CustomerInfoCard";
import StatusCard from "./StatusCard";
import RiderCard from "./RiderCard";
import OrderSummary from "./OrderSummary";
import OrderTimeline from "./OrderTimeline";
import EditableOrderItems from "./EditableOrderItems";

import { printReceipt } from "@/src/utils/printReceipt";
import { InvoiceData } from "@/src/types/invoice";

export default function OrderDetailsPanel({
  order,
  riders,
  selectedRider,
  setSelectedRider,
  assignRider,
  updateStatus,
  items,
  setItems,
  saveItems,
  saving,
}: any) {
  if (!order) {
    return (
      <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
        Select Order
      </div>
    );
  }

  // 🔴 LOCK CHECK FOR DELIVERED AND CANCELLED
  const locked =
    order.orderStatus === "DELIVERED" || order.orderStatus === "CANCELLED";

  // 🔴 BUILD INVOICE WITH ORIGINAL AND ACCURATE CALCULATIONS
  const buildInvoice = (): InvoiceData => {
    // ১. আইটেমের সাবটোটাল হিসাব (বর্তমান ইউনিট প্রাইজ × কোয়ান্টিটি)
    const subtotal =
      items?.reduce((sum: number, item: any) => {
        const unitPrice = Number(item.price || 0);
        const qty = Number(item.quantity || 1);
        return sum + unitPrice * qty;
      }, 0) || 0;

    const deliveryCharge = Number(order.deliveryCharge || 0);

    // ২. অরিজিনাল ডিসকাウント/রিওয়ার্ড পয়েন্ট ছাড় হিসাব
    const discount = Number(
      order.rewardUsed ?? order.discountAmount ?? order.discount ?? 0
    );

    // ৩. ফাইনাল গ্র্যান্ড টোটাল
    const total =
      order.finalAmount ?? (subtotal + deliveryCharge - discount);

    return {
      invoiceNumber: order.orderNumber,
      orderNumber: order.orderNumber,
      invoiceDate: order.createdAt || new Date().toISOString(),

      customer: {
        name: order.shippingAddress?.fullName || "Customer",
        phone: order.customerPhone || "N/A",
        address: `${order.shippingAddress?.areaOrVillage || ""} ${order.shippingAddress?.landmark || ""}`.trim() || "N/A",
      },

      items: (items || []).map((item: any) => {
        const unitPrice = Number(item.price || 0);
        const qty = Number(item.quantity || 1);

        const enName =
          typeof item.productName === "object"
            ? item.productName?.en
            : item.product?.title?.en || item.title?.en || item.productName || "Product";

        const bnName =
          typeof item.productName === "object"
            ? item.productName?.bn
            : item.product?.title?.bn || item.title?.bn || "";

        const unit = item.unit || item.product?.unit || "pcs";

        return {
          productName: enName,
          productNameBn: bnName,
          unit: unit,
          quantity: qty,
          price: unitPrice,
          totalPrice: unitPrice * qty,
        };
      }),

      subtotal,
      deliveryCharge,
      discount,
      total,

      paymentMethod: order.paymentMethod || "CASH ON DELIVERY",
      paymentStatus: Boolean(order.isPaid),
      orderStatus: order.orderStatus,
    };
  };

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="bg-white border rounded-2xl p-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {items?.length || 0} Items • Delivery Order
          </p>
        </div>

        <button
          onClick={() => printReceipt(buildInvoice())}
          className="border px-5 py-2 rounded-xl text-sm hover:bg-gray-50 flex items-center gap-2 font-medium transition"
        >
          🖨 Print Receipt
        </button>
      </div>

      {/* CUSTOMER / STATUS / RIDER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border p-1">
          <CustomerInfoCard order={order} />
        </div>

        <div className="bg-white rounded-2xl border p-1">
          <StatusCard order={order} onChange={updateStatus} />
        </div>

        <div className="bg-white rounded-2xl border p-1">
          <RiderCard
            riders={riders}
            selectedRider={selectedRider}
            setSelectedRider={setSelectedRider}
            assign={assignRider}
            locked={locked}
          />
        </div>
      </div>

      {/* ORDER ITEMS */}
      <div>
        <EditableOrderItems
          items={items}
          setItems={setItems}
          locked={locked}
        />
      </div>

      {/* SAVE BUTTON */}
      {!locked && (
        <div className="flex justify-end">
          <button
            onClick={saveItems}
            disabled={saving}
            className="bg-blue-600 text-white px-7 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* SUMMARY + TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border rounded-2xl p-1">
          <OrderSummary
            order={{
              ...order,
              items,
            }}
          />
        </div>

        <div className="bg-white border rounded-2xl p-1">
          <OrderTimeline order={order} />
        </div>
      </div>
    </div>
  );
}

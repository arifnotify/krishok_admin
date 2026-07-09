"use client";

import CustomerInfoCard from "./CustomerInfoCard";
import StatusCard from "./StatusCard";
import RiderCard from "./RiderCard";
import OrderSummary from "./OrderSummary";
import OrderTimeline from "./OrderTimeline";
import EditableOrderItems from "./EditableOrderItems";

import { generateInvoice } from "@/src/utils/generateInvoice";

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
      <div className="bg-white border rounded-2xl p-10">
        Select Order
      </div>
    );
  }

  const locked =
    order.orderStatus === "Delivered" ||
    order.orderStatus === "Cancelled";

  const buildInvoice = () => {
    const subtotal =
      items?.reduce(
        (sum: number, i: any) => sum + (i.totalPrice || 0),
        0
      ) || 0;

    return {
      invoiceNumber: order.orderNumber,
      orderNumber: order.orderNumber,
      invoiceDate: new Date().toISOString(),
      customer: {
        name: order.shippingAddress?.fullName || "Customer",
        phone: order.customerPhone,
        address: `${order.shippingAddress?.areaOrVillage || ""} ${order.shippingAddress?.landmark || ""}`,
      },
      items,
      subtotal,
      deliveryCharge: order.deliveryCharge || 0,
      discount: order.discount || 0,
      total: subtotal,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.isPaid,
      orderStatus: order.orderStatus,
    };
  };

  return (
<div className="flex justify-end">

<button
 onClick={() => printReceipt(buildInvoice())}
 className="
 bg-blue-600
 text-white
 px-5
 py-2
 rounded-xl
 hover:bg-blue-700
 "
>

🖨️ Print Receipt

</button>

</div>

      {/* =========================
          STEP 7: 3 CARD GRID
      ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* CARD 1 */}
        <CustomerInfoCard order={order} />

        {/* CARD 2 */}
        <StatusCard order={order} onChange={updateStatus} />

        {/* CARD 3 */}
        <RiderCard
          riders={riders}
          selectedRider={selectedRider}
          setSelectedRider={setSelectedRider}
          assign={assignRider}
          locked={locked}
        />

      </div>

      {/* =========================
          ITEMS SECTION
      ========================= */}
      <EditableOrderItems
        items={items}
        setItems={setItems}
        locked={locked}
      />

      {/* SAVE BUTTON */}
      {!locked && (
        <button
          onClick={saveItems}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      )}

      {/* BOTTOM GRID (SUMMARY + TIMELINE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <OrderSummary order={{ ...order, items }} />

        <OrderTimeline order={order} />

      </div>

    </div>
  );
}

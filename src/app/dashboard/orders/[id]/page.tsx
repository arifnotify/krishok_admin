"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getOrder,
  updateOrderStatus,
  assignRider,
  adminEditOrder,
} from "@/src/services/order.service";

import { getRiders } from "@/src/services/rider.service";

import CustomerInfoCard from "@/src/components/orders/CustomerInfoCard";
import StatusCard from "@/src/components/orders/StatusCard";
import RiderCard from "@/src/components/orders/RiderCard";
import OrderSummary from "@/src/components/orders/OrderSummary";
import OrderTimeline from "@/src/components/orders/OrderTimeline";
import EditableOrderItems from "@/src/components/orders/EditableOrderItems";

import { generateInvoice } from "@/src/utils/generateInvoice";
import { InvoiceData } from "@/src/types/invoice";

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [riders, setRiders] = useState<any[]>([]);
  const [selectedRider, setSelectedRider] = useState("");

  // =========================
  // LOAD ORDER
  // =========================
  useEffect(() => {
    if (!id) return;

    loadOrder();
    loadRiders();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);

      const data = await getOrder(id);

      setOrder(data);
      setItems(data.items || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRiders = async () => {
    try {
      const data = await getRiders();
      setRiders(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // ORDER → INVOICE MAPPER
  // =========================
  const buildInvoice = (order: any): InvoiceData => {
    const subtotal = order.items.reduce(
      (sum: number, item: any) =>
        sum + item.totalPrice,
      0
    );

    const deliveryCharge =
      order.deliveryCharge || 0;

    const discount =
      order.discount || 0;

    return {
      invoiceNumber: order.orderNumber,
      orderNumber: order.orderNumber,
      invoiceDate: new Date().toISOString(),

      customer: {
        name:
          order.shippingAddress?.fullName ||
          "Customer",
        phone: order.customerPhone,
        address: `${order.shippingAddress?.areaOrVillage || ""} ${order.shippingAddress?.landmark || ""}`,
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
      paymentStatus: order.isPaid,
      orderStatus: order.orderStatus,
    };
  };

  // =========================
  // STATUS UPDATE
  // =========================
  const handleStatusChange = async (status: string) => {
    try {
      await updateOrderStatus(order._id, status);

      setOrder((prev: any) => ({
        ...prev,
        orderStatus: status,
      }));

      alert("Status Updated");
    } catch (err) {
      console.log(err);
      alert("Status Update Failed");
    }
  };

  // =========================
  // ASSIGN RIDER
  // =========================
  const handleAssignRider = async () => {
    try {
      if (!selectedRider) {
        alert("Select Rider First");
        return;
      }

      await assignRider(order._id, selectedRider);

      alert("Rider Assigned");

      loadOrder();
    } catch (err) {
      console.log(err);
      alert("Assign Failed");
    }
  };

  // =========================
  // SAVE ITEMS
  // =========================
  const handleSave = async () => {
    try {
      setSaving(true);

const payload = items.map(item=>({
  product:item.product,
  productName:item.productName || "",
  productImage:item.productImage || "",
  price:Number(item.price),
  quantity:Number(item.quantity),
}));

      await adminEditOrder(order._id, payload);

      alert("Order Updated Successfully");

      loadOrder();
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading Order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center text-red-500">
        Order Not Found
      </div>
    );
  }

  // =========================
  // LOCK SYSTEM
  // =========================
  const locked =
    order.orderStatus === "Delivered" ||
    order.orderStatus === "Cancelled";

  return (
    <div className="bg-gray-50 min-h-screen p-5">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Order #{order.orderNumber}
        </h1>

        <p className="text-gray-500">
          Manage Order Details
        </p>

      </div>

      {/* INVOICE BUTTON */}
      <div className="mb-6">

        <button
          onClick={() =>
            generateInvoice(
              buildInvoice(order)
            )
          }
          className="
            bg-green-600
            text-white
            px-5
            py-2
            rounded-xl
            hover:bg-green-700
          "
        >
          📄 Download Invoice
        </button>

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <CustomerInfoCard order={order} />

          <StatusCard
            order={order}
            onChange={handleStatusChange}
          />

          <RiderCard
            riders={riders}
            selectedRider={selectedRider}
            setSelectedRider={setSelectedRider}
            assign={handleAssignRider}
            locked={locked}
          />

          <EditableOrderItems
          orderId={order._id}
          items={items}
          setItems={setItems}
          locked={locked}
          />

          {!locked && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="
                bg-blue-600
                text-white
                px-6
                py-3
                rounded-xl
              "
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          )}

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <OrderSummary order={{ ...order, items }} />

          <OrderTimeline order={order} />

          {locked && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <p className="text-red-600 font-bold">
                Order Locked
              </p>
              <p className="text-sm text-red-500">
                Delivered / Cancelled orders cannot be edited.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
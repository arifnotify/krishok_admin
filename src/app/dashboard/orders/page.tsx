"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ShoppingCart,
  Clock3,
  CheckCircle,
  DollarSign,
} from "lucide-react";

import {
  getOrders,
  getOrder,
  updateOrderStatus,
  assignRider,
  adminEditOrder,
} from "@/src/services/order.service";

import { getRiders } from "@/src/services/rider.service";

import OrdersSidebar from "@/src/components/orders/OrdersSidebar";
import OrderDetailsPanel from "@/src/components/orders/OrderDetailsPanel";

import OrderSearch from "@/src/components/orders/OrderSearch";
import OrderTabs from "@/src/components/orders/OrderTabs";

import OrderStatCard from "@/src/components/dashboard/OrderStatCard";

import {
  Order,
  OrderItem,
  OrderStatus,
} from "@/src/types/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [items, setItems] = useState<OrderItem[]>([]);
  const [riders, setRiders] = useState<any[]>([]);

  const [selectedRider, setSelectedRider] =
    useState("");
useEffect(() => {

  if (!selectedOrder?.assignedRider) {
    setSelectedRider("");
    return;
  }

  if (
    typeof selectedOrder.assignedRider ===
    "string"
  ) {

    setSelectedRider(
      selectedOrder.assignedRider
    );

  } else {

    setSelectedRider(
      selectedOrder.assignedRider._id
    );

  }

}, [selectedOrder]);

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<OrderStatus | "All">("All");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // ==========================
  // LOAD ALL DATA
  // ==========================
  const loadData = async () => {
    try {
      setLoading(true);

      const [ordersData, ridersData] =
        await Promise.all([
          getOrders(),
          getRiders(),
        ]);

      setOrders(ordersData || []);

      setRiders(ridersData || []);

      if (ordersData?.length > 0) {
        await loadSingleOrder(
          ordersData[0]._id
        );
      }
    } catch (err) {
      console.error(
        "Failed to load orders:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOAD SINGLE ORDER
  // ==========================
const loadSingleOrder = async (
  id: string
) => {
  try {

    const data = await getOrder(id);

    setSelectedOrder(data);

    setItems(data?.items || []);


    // =========================
    // LOAD ASSIGNED RIDER
    // =========================

    if (
      data?.assignedRider?._id
    ) {

      setSelectedRider(
        data.assignedRider._id
      );

    } else {

      setSelectedRider("");

    }

  } catch (err) {

    console.error(
      "Failed to load order:",
      err
    );

  }
};

  // ==========================
  // UPDATE STATUS
  // ==========================
  const handleStatusChange = async (
    newStatus: OrderStatus
  ) => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus(
        selectedOrder._id,
        newStatus
      );

      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: newStatus,
            }
          : null
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id
            ? {
                ...order,
                orderStatus: newStatus,
              }
            : order
        )
      );
    } catch (err) {
      console.error(
        "Failed to update status:",
        err
      );
    }
  };

  // ==========================
  // ASSIGN RIDER
  // ==========================
  const handleAssignRider =
    async () => {
      if (
        !selectedOrder ||
        !selectedRider
      )
        return;

      try {
        await assignRider(
          selectedOrder._id,
          selectedRider
        );

        await loadSingleOrder(
          selectedOrder._id
        );
      } catch (err) {
        console.error(
          "Failed to assign rider:",
          err
        );
      }
    };

  // ==========================
  // SAVE ORDER ITEMS
  // ==========================
  const handleSaveItems =
    async () => {
      if (!selectedOrder) return;

      setSaving(true);

      try {
        await adminEditOrder(
          selectedOrder._id,
          items.map((item) => ({
            product: item.product!,

            productName: {
              en:
                typeof item.productName ===
                "object"
                  ? item.productName.en || ""
                  : item.productName,

              bn:
                typeof item.productName ===
                "object"
                  ? item.productName.bn ||
                    ""
                  : "",
            },

            unit:
              item.unit || "pcs",

            productImage:
              item.productImage || "",

            price: Number(
              item.price || 0
            ),

            quantity: Number(
              item.quantity || 1
            ),
          }))
        );

        await loadSingleOrder(
          selectedOrder._id
        );
      } catch (err) {
        console.error(
          "Failed to save items:",
          err
        );
      } finally {
        setSaving(false);
      }
    };
  // ==========================================
  // SEARCH & FILTER
  // ==========================================
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order.customerPhone
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All"
          ? true
          : order.orderStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  // ==========================================
  // ACTIVE ORDERS
  // ==========================================
  const activeOrders = useMemo(() => {
    return filteredOrders.filter(
      (order) =>
        order.orderStatus !== "Delivered" &&
        order.orderStatus !== "Cancelled"
    );
  }, [filteredOrders]);

  // ==========================================
  // COMPLETED ORDERS
  // ==========================================
  const completedOrders = useMemo(() => {
    return filteredOrders.filter(
      (order) =>
        order.orderStatus === "Delivered" ||
        order.orderStatus === "Cancelled"
    );
  }, [filteredOrders]);

  // ==========================================
  // PENDING COUNT
  // ==========================================
  const pendingCount = useMemo(() => {
    return orders.filter(
      (order) => order.orderStatus === "Pending"
    ).length;
  }, [orders]);

  // ==========================================
  // DELIVERED COUNT
  // ==========================================
  const deliveredCount = useMemo(() => {
    return orders.filter(
      (order) => order.orderStatus === "Delivered"
    ).length;
  }, [orders]);

  // ==========================================
  // TOTAL REVENUE
  // ==========================================
  const totalRevenue = useMemo(() => {
    return orders
      .filter(
        (order) => order.orderStatus === "Delivered"
      )
      .reduce(
        (sum, order) =>
          sum +
          Number(
            order.finalAmount ??
              order.totalAmount ??
              0
          ),
        0
      );
  }, [orders]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 font-medium">
        Loading Orders...
      </div>
    );
  }
  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* =========================
          STATS
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <OrderStatCard
          title="Total Orders"
          value={orders.length}
          icon={ShoppingCart}
          gradient="from-orange-500 to-red-500"
        />

        <OrderStatCard
          title="Pending Orders"
          value={pendingCount}
          icon={Clock3}
          gradient="from-yellow-500 to-orange-500"
        />

        <OrderStatCard
          title="Delivered Orders"
          value={deliveredCount}
          icon={CheckCircle}
          gradient="from-green-500 to-emerald-500"
        />

        <OrderStatCard
          title="Revenue"
          value={`৳${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          gradient="from-blue-500 to-cyan-500"
        />
      </div>

      {/* =========================
          SEARCH + FILTER
      ========================= */}
      <div className="bg-white border rounded-2xl p-5 mb-5 shadow-sm">
        <OrderSearch
          value={search}
          onChange={setSearch}
        />

        <div className="mt-4">
          <OrderTabs
            active={status}
            onChange={setStatus}
          />
        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-4">
          <OrdersSidebar
            activeOrders={activeOrders}
            completedOrders={completedOrders}
            selectedId={selectedOrder?._id}
            onSelect={loadSingleOrder}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-8">
          <OrderDetailsPanel
            order={selectedOrder}
            items={items}
            setItems={setItems}
            riders={riders}
            selectedRider={selectedRider}
            setSelectedRider={setSelectedRider}
            updateStatus={handleStatusChange}
            assignRider={handleAssignRider}
            saveItems={handleSaveItems}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [items, setItems] = useState<OrderItem[]>([]);
  const [riders, setRiders] = useState<any[]>([]);

  const [selectedRider, setSelectedRider] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<OrderStatus | "All">("All");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const ordersData = await getOrders();
      const ridersData = await getRiders();

      setOrders(ordersData || []);
      setRiders(ridersData || []);

      if (ordersData?.length > 0) {
        await loadSingleOrder(ordersData[0]._id);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSingleOrder = async (id: string) => {
    try {
      const data = await getOrder(id);

      setSelectedOrder(data);
      setItems(data.items || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus(selectedOrder._id, newStatus);

      setSelectedOrder((prev: any) => ({
        ...prev,
        orderStatus: newStatus,
      }));

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
      console.log(err);
    }
  };

  const handleAssignRider = async () => {
    if (!selectedOrder || !selectedRider) return;

    try {
      await assignRider(selectedOrder._id, selectedRider);

      loadSingleOrder(selectedOrder._id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveItems = async () => {
    if (!selectedOrder) return;

    setSaving(true);

    try {
      await adminEditOrder(
        selectedOrder._id,
        items.map((item) => ({
          product: item.product!,
          productName: item.productName || "",
          productImage: item.productImage || "",
          price: Number(item.price),
          quantity: Number(item.quantity),
        }))
      );

      loadSingleOrder(selectedOrder._id);
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const searchedOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.orderNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.customerPhone.includes(search)
    );
  }, [orders, search]);

  const filteredOrders = searchedOrders.filter((order) =>
    status === "All" ? true : order.orderStatus === status
  );

  // 🔴 FIXED: UPPERCASE ENUM VALUES
  const activeOrders = filteredOrders.filter(
    (order) =>
      order.orderStatus !== "DELIVERED" &&
      order.orderStatus !== "CANCELLED"
  );

  // 🔴 FIXED: UPPERCASE ENUM VALUES
  const completedOrders = filteredOrders.filter(
    (order) =>
      order.orderStatus === "DELIVERED" ||
      order.orderStatus === "CANCELLED"
  );

  // 🔴 FIXED: UPPERCASE ENUM VALUES
  const pendingCount = orders.filter(
    (order) => order.orderStatus === "PENDING"
  ).length;

  // 🔴 FIXED: UPPERCASE ENUM VALUES
  const deliveredCount = orders.filter(
    (order) => order.orderStatus === "DELIVERED"
  ).length;

  // 🔴 FIXED: UPPERCASE ENUM VALUES
  const totalRevenue = orders
    .filter((order) => order.orderStatus === "DELIVERED")
    .reduce((sum, order) => sum + (order.finalAmount ?? order.totalAmount ?? 0), 0);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* STATS */}
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

      {/* SEARCH */}
      <div className="bg-white border rounded-2xl p-5 mb-5">
        <OrderSearch value={search} onChange={setSearch} />

        <div className="mt-4">
          <OrderTabs active={status} onChange={setStatus} />
        </div>
      </div>

      {/* MAIN */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* SIDEBAR */}
        <div className="lg:col-span-4">
          <OrdersSidebar
            activeOrders={activeOrders}
            completedOrders={completedOrders}
            selectedId={selectedOrder?._id}
            onSelect={loadSingleOrder}
          />
        </div>

        {/* DETAILS */}
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

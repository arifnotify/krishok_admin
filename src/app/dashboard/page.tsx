"use client";

import { useEffect, useMemo, useState } from "react";

import StatsCards from "@/src/components/dashboard/StatsCards";
import OrdersSidebar from "@/src/components/orders/OrdersSidebar";
import OrderDetailsPanel from "@/src/components/orders/OrderDetailsPanel";
import OrderSearch from "@/src/components/orders/OrderSearch";
import OrderTabs from "@/src/components/orders/OrderTabs";

import {
  getOrders,
  getOrder,
  updateOrderStatus,
  assignRider,
  adminEditOrder,
} from "@/src/services/order.service";

import { getRiders } from "@/src/services/rider.service";
import { getDashboardSummary } from "@/src/services/analytics.service";

import { Order, OrderItem, OrderStatus } from "@/src/types/order";
import { DashboardSummary } from "@/src/types/dashboard";

export default function DashboardPage() {
  // =========================
  // DASHBOARD SUMMARY
  // =========================
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  // =========================
  // ORDER STATE
  // =========================
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  const [riders, setRiders] = useState<any[]>([]);
  const [selectedRider, setSelectedRider] = useState("");

  // =========================
  // SEARCH & FILTER
  // =========================
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "All">("All");

  // =========================
  // LOADING STATES
  // =========================
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD INITIAL DATA
  // =========================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [summaryData, ordersData, ridersData] = await Promise.all([
        getDashboardSummary(),
        getOrders(),
        getRiders(),
      ]);

      setSummary(summaryData);
      setOrders(ordersData || []);
      setRiders(ridersData || []);

      if (ordersData?.length > 0) {
        await loadSingleOrder(ordersData[0]._id);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD SINGLE ORDER
  // =========================
  const loadSingleOrder = async (id: string) => {
    try {
      const data = await getOrder(id);
      setSelectedOrder(data);
      setItems(data?.items || []);
    } catch (err) {
      console.error("Failed to load order details:", err);
    }
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================
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
      console.error("Failed to update order status:", err);
    }
  };

  // =========================
  // ASSIGN RIDER
  // =========================
  const handleAssignRider = async () => {
    if (!selectedOrder || !selectedRider) return;

    try {
      await assignRider(selectedOrder._id, selectedRider);
      await loadSingleOrder(selectedOrder._id);
    } catch (err) {
      console.error("Failed to assign rider:", err);
    }
  };

  // =========================
  // SAVE ORDER ITEMS
  // =========================
  const handleSaveItems = async () => {
    if (!selectedOrder) return;

    try {
      setSaving(true);

      await adminEditOrder(
        selectedOrder._id,
        items.map((item) => ({
          product: item.product!,
          productName: item.productName || "",
          productImage: item.productImage || "",
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
        }))
      );

      await loadSingleOrder(selectedOrder._id);
    } catch (err) {
      console.error("Failed to save order items:", err);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // SEARCH & FILTER LOGIC
  // =========================
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search Query Matching
      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
        order.customerPhone?.includes(search);

      // 2. Tab Status Matching (Case Insensitive)
      const matchesStatus =
        status === "All"
          ? true
          : order.orderStatus?.toUpperCase() === status.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  // =========================
  // ACTIVE ORDERS (Not Delivered & Not Cancelled)
  // =========================
  const activeOrders = useMemo(() => {
    return filteredOrders.filter((order) => {
      const st = order.orderStatus?.toUpperCase();
      return st !== "DELIVERED" && st !== "CANCELLED";
    });
  }, [filteredOrders]);

  // =========================
  // COMPLETED ORDERS (Delivered or Cancelled)
  // =========================
  const completedOrders = useMemo(() => {
    return filteredOrders.filter((order) => {
      const st = order.orderStatus?.toUpperCase();
      return st === "DELIVERED" || st === "CANCELLED";
    });
  }, [filteredOrders]);

  // =========================
  // LOADING STATE UI
  // =========================
  if (loading || !summary) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 font-medium">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your business</p>
      </div>

      {/* STATS */}
      <div className="mb-6">
        <StatsCards summary={summary} />
      </div>

      {/* SEARCH + TABS */}
      <div className="bg-white border rounded-2xl p-5 mb-6 shadow-sm">
        <OrderSearch value={search} onChange={setSearch} />

        <div className="mt-4">
          <OrderTabs active={status} onChange={setStatus} />
        </div>
      </div>

      {/* ORDER MANAGEMENT */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* LEFT ORDER LIST */}
        <div className="lg:col-span-4">
          <OrdersSidebar
            activeOrders={activeOrders}
            completedOrders={completedOrders}
            selectedId={selectedOrder?._id}
            onSelect={loadSingleOrder}
          />
        </div>

        {/* RIGHT DETAILS */}
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

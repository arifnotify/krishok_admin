"use client";

import { useEffect, useMemo, useState } from "react";

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

import { Order, OrderItem, OrderStatus } from "@/src/types/order";
import StatCard from "@/src/components/dashboard/StatsCards";

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

    await updateOrderStatus(selectedOrder._id, newStatus);

    setSelectedOrder((prev: any) => ({
      ...prev,
      orderStatus: newStatus,
    }));
  };

  const handleAssignRider = async () => {
    if (!selectedOrder || !selectedRider) return;

    await assignRider(selectedOrder._id, selectedRider);

    loadSingleOrder(selectedOrder._id);
  };

  const handleSaveItems = async () => {
    if (!selectedOrder) return;

    setSaving(true);

    try {
      await adminEditOrder(
        selectedOrder._id,
        items.map((i) => ({
          product: i.product!,
          quantity: i.quantity,
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
    return orders.filter((o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search)
    );
  }, [orders, search]);

  const filteredOrders = searchedOrders.filter((o) =>
    status === "All" ? true : o.orderStatus === status
  );

  const activeOrders = filteredOrders.filter(
    (o) => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled"
  );

  const completedOrders = filteredOrders.filter(
    (o) => o.orderStatus === "Delivered" || o.orderStatus === "Cancelled"
  );

  const pendingCount = orders.filter((o) => o.orderStatus === "Pending").length;

  const deliveredCount = orders.filter((o) => o.orderStatus === "Delivered").length;

  const totalRevenue = orders
    .filter((o) => o.orderStatus === "Delivered")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-5 bg-gray-50 min-h-screen">

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Orders" value={orders.length} />
        <StatCard title="Pending" value={pendingCount} />
        <StatCard title="Delivered" value={deliveredCount} />
        <StatCard title="Revenue" value={`৳${totalRevenue}`} />
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
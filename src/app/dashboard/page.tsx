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

import {
  Order,
  OrderItem,
  OrderStatus,
} from "@/src/types/order";

import { DashboardSummary } from "@/src/types/dashboard";

export default function DashboardPage() {

  // =========================
  // DASHBOARD SUMMARY
  // =========================

  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  // =========================
  // ORDER STATE
  // =========================

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [items, setItems] =
    useState<OrderItem[]>([]);

  const [riders, setRiders] =
    useState<any[]>([]);

  const [selectedRider, setSelectedRider] =
    useState("");

  // =========================
  // SEARCH & FILTER
  // =========================

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<OrderStatus | "All">("All");

  // =========================
  // LOADING
  // =========================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      setLoading(true);

      const [
        summaryData,
        ordersData,
        ridersData,
      ] = await Promise.all([
        getDashboardSummary(),
        getOrders(),
        getRiders(),
      ]);

      setSummary(summaryData);

      setOrders(ordersData || []);

      setRiders(ridersData || []);

      if (ordersData?.length > 0) {
        await loadSingleOrder(
          ordersData[0]._id
        );
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // LOAD SINGLE ORDER
  // =========================

  const loadSingleOrder = async (
    id: string
  ) => {

    try {

      const data =
        await getOrder(id);

      setSelectedOrder(data);

      setItems(data.items || []);

    } catch (err) {

      console.log(err);

    }

  };
    // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleStatusChange = async (
    newStatus: OrderStatus
  ) => {

    if (!selectedOrder) return;

    try {

      await updateOrderStatus(
        selectedOrder._id,
        newStatus
      );

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

  // =========================
  // ASSIGN RIDER
  // =========================

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

        console.log(err);

      }

    };

  // =========================
  // SAVE ORDER ITEMS
  // =========================

  const handleSaveItems =
    async () => {

      if (!selectedOrder) return;

      try {

        setSaving(true);

        await adminEditOrder(
          selectedOrder._id,
          items.map((item) => ({
            product: item.product!,
            quantity: item.quantity,
          }))
        );

        await loadSingleOrder(
          selectedOrder._id
        );

      } catch (err) {

        console.log(err);

      } finally {

        setSaving(false);

      }

    };

  // =========================
  // SEARCH
  // =========================

  const searchedOrders =
    useMemo(() => {

      return orders.filter(
        (order) =>
          order.orderNumber
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          order.customerPhone?.includes(
            search
          )
      );

    }, [orders, search]);

  // =========================
  // FILTER
  // =========================

  const filteredOrders =
    searchedOrders.filter((order) =>
      status === "All"
        ? true
        : order.orderStatus ===
          status
    );

  // =========================
  // ACTIVE ORDER
  // =========================

  const activeOrders =
    filteredOrders.filter(
      (order) =>
        order.orderStatus !==
          "Delivered" &&
        order.orderStatus !==
          "Cancelled"
    );

  // =========================
  // COMPLETED ORDER
  // =========================

  const completedOrders =
    filteredOrders.filter(
      (order) =>
        order.orderStatus ===
          "Delivered" ||
        order.orderStatus ===
          "Cancelled"
    );

  // =========================
  // LOADING
  // =========================

  if (loading || !summary) {

    return (
      <div className="p-10">
        Loading Dashboard...
      </div>
    );

  }
    return (

    <div className="p-5 bg-gray-50 min-h-screen">


      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Overview of your business
        </p>

      </div>



      {/* =========================
          STATS
      ========================= */}

      <div className="mb-6">

        <StatsCards
          summary={summary}
        />

      </div>




      {/* =========================
          SEARCH + TABS
      ========================= */}

      <div className="
        bg-white
        border
        rounded-2xl
        p-5
        mb-6
      ">


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
          ORDER MANAGEMENT
      ========================= */}


      <div className="
        grid
        lg:grid-cols-12
        gap-5
      ">



        {/* =====================
            LEFT ORDER LIST
        ====================== */}


        <div className="
          lg:col-span-4
        ">


          <OrdersSidebar

            activeOrders={
              activeOrders
            }


            completedOrders={
              completedOrders
            }


            selectedId={
              selectedOrder?._id
            }


            onSelect={
              loadSingleOrder
            }

          />


        </div>





        {/* =====================
            RIGHT DETAILS
        ====================== */}



        <div className="
          lg:col-span-8
        ">


          <OrderDetailsPanel


            order={
              selectedOrder
            }


            items={
              items
            }


            setItems={
              setItems
            }


            riders={
              riders
            }


            selectedRider={
              selectedRider
            }


            setSelectedRider={
              setSelectedRider
            }


            updateStatus={
              handleStatusChange
            }


            assignRider={
              handleAssignRider
            }


            saveItems={
              handleSaveItems
            }


            saving={
              saving
            }


          />


        </div>



      </div>


    </div>

  );


}
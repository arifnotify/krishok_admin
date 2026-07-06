"use client";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/src/services/analytics.service";
import { DashboardSummary } from "@/src/types/dashboard";

export default function DashboardPage() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

const fetchSummary = async () => {
  console.log("🚀 Fetch Started");

  try {
    const data = await getDashboardSummary();

    console.log("🔥 API DATA:", data);

    if (!data) {
      console.log("❌ API returned empty data");
      return;
    }

    setSummary(data);

    console.log("✅ setSummary done");

  } catch (error) {
    console.log("❌ Dashboard API Error:", error);
  } finally {
    setLoading(false);
  }
};

  console.log("📊 CURRENT STATE:", summary);

  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  if (!summary) {
    return <div>❌ No Summary Data</div>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      {/* DEBUG UI */}
      <pre className="bg-black text-green-400 p-4 rounded">
        {JSON.stringify(summary, null, 2)}
      </pre>

      <div className="grid grid-cols-4 gap-5">

        <div className="bg-white p-6 rounded-2xl shadow">
          Total Users: {summary.totalUsers}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          Total Products: {summary.totalProducts}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          Total Orders: {summary.totalOrders}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          Revenue: ${summary.totalRevenue}
        </div>

      </div>

    </div>
  );
}
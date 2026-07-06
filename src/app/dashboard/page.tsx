"use client";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/src/services/analytics.service";
import StatsCards from "@/src/components/dashboard/StatsCards";
import { DashboardSummary } from "@/src/types/dashboard";

export default function DashboardPage() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getDashboardSummary();

      console.log("SUMMARY API:", res);

      setSummary(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  if (!summary) {
    return <div>No Data Found</div>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <StatsCards summary={summary} />

    </div>
  );
}
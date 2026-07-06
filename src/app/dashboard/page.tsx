"use client";

import { useEffect, useState } from "react";

import StatsCards from "@/src/components/dashboard/StatsCards";

import { DashboardSummary } from "@/src/types/dashboard";

import { getDashboardSummary } from "@/src/services/analytics.service";

export default function DashboardPage() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data =
        await getDashboardSummary();

      setSummary(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Overview of your business
        </p>
      </div>

      <StatsCards
        summary={summary}
      />
    </div>
  );
}
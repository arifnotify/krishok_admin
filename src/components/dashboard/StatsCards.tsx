"use client";

import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
} from "lucide-react";

import { DashboardSummary } from "@/src/types/dashboard";

interface Props {
  summary: DashboardSummary;
}

export default function StatsCards({
  summary,
}: Props) {
  const cards = [
    {
      title: "Total Users",
      value: summary.totalUsers,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Products",
      value: summary.totalProducts,
      icon: Package,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Total Orders",
      value: summary.totalOrders,
      icon: ShoppingCart,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Revenue",
      value: `৳${summary.totalRevenue}`,
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              bg-white
              rounded-2xl
              p-6
              border
              shadow-sm
              hover:shadow-lg
              transition-all
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`
                  w-14
                  h-14
                  rounded-xl
                  bg-gradient-to-r
                  ${card.gradient}
                  flex
                  items-center
                  justify-center
                  text-white
                `}
              >
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
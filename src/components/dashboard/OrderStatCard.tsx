"use client";

import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: string;
}

export default function OrderStatCard({
  title,
  value,
  icon: Icon,
  gradient = "from-blue-500 to-cyan-500",
}: Props) {
  return (
    <div
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
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`
            w-14
            h-14
            rounded-xl
            bg-gradient-to-r
            ${gradient}
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
}
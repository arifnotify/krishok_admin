"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getFlashSales,
} from "@/src/services/flash-sale.service";

export default function FlashSaleWidget() {
  const [count,
    setCount] =
    useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData =
    async () => {
      const data =
        await getFlashSales();

      const active =
        data.filter(
          (item: any) =>
            item.isActive,
        );

      setCount(
        active.length,
      );
    };

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="text-lg font-semibold">
        Active Flash Sales
      </h2>

      <p className="text-4xl font-bold mt-3">
        {count}
      </p>

    </div>
  );
}
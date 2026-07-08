"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  getFlashSaleById,
} from "@/src/services/flash-sale.service";

import CountdownTimer from "@/src/components/flash-sale/CountdownTimer";

export default function FlashSaleDetailsPage() {

  const params =
    useParams();

  const [sale, setSale] =
    useState<any>();

  useEffect(() => {
    fetchSale();
  }, []);

  const fetchSale =
    async () => {
      try {
        const data =
          await getFlashSaleById(
            params.id as string,
          );

        setSale(data);
      } catch (error) {
        console.log(error);
      }
    };

  if (!sale) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div>

      <div className="bg-white p-6 rounded-xl shadow">

        <h1 className="text-3xl font-bold">
          {sale.title}
        </h1>

        <div className="mt-4">

          <CountdownTimer
            endTime={
              sale.endTime
            }
          />

        </div>

        <div className="mt-3">

          {sale.isActive ? (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
              Expired
            </span>
          )}

        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-6">

        {sale.products?.map(
          (
            item: any,
          ) => (
            <div
              key={
                item._id
              }
              className="bg-white rounded-xl shadow p-4"
            >

              <img
                src={
                  item.product
                    ?.images?.[0]
                }
                className="w-full h-40 object-cover rounded-lg"
              />

              <h2 className="font-bold mt-3">
                {
                  item.product
                    ?.name
                }
              </h2>

              <div className="flex gap-3 mt-2">

                <span className="line-through text-gray-400">
                  ৳
                  {
                    item.oldPrice
                  }
                </span>

                <span className="font-bold text-red-600">
                  ৳
                  {
                    item.salePrice
                  }
                </span>

              </div>

            </div>
          ),
        )}

      </div>

    </div>
  );
}
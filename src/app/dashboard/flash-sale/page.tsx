"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  deleteFlashSale,
  expireFlashSales,
  getFlashSales,
} from "@/src/services/flash-sale.service";

export default function FlashSalePage() {
  const [sales, setSales] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales =
    async () => {
      try {
        const data =
          await getFlashSales();

        setSales(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleDelete =
    async (id: string) => {
      if (
        !confirm(
          "Delete Flash Sale?"
        )
      )
        return;

      try {
        await deleteFlashSale(id);

        fetchSales();
      } catch (error) {
        console.log(error);
      }
    };

  const handleExpire =
    async () => {
      try {
        await expireFlashSales();

        fetchSales();

        alert(
          "Expired Sales Updated",
        );
      } catch (error) {
        console.log(error);
      }
    };

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Flash Sales
        </h1>

        <div className="flex gap-3">

          <button
            onClick={
              handleExpire
            }
            className="bg-orange-500 text-white px-4 py-3 rounded-xl"
          >
            Check Expired
          </button>

          <Link
            href="/flash-sale/create"
          >
            <button className="bg-black text-white px-5 py-3 rounded-xl">
              Create Flash Sale
            </button>
          </Link>

        </div>

      </div>

      <div className="grid gap-5">

        {sales.map(
          (sale: any) => (
            <div
              key={sale._id}
              className="bg-white p-5 rounded-xl shadow"
            >

              <div className="flex justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    {sale.title}
                  </h2>

                  <p>
                    Products:
                    {" "}
                    {
                      sale.products
                        ?.length
                    }
                  </p>

                  <p>
                    Start:
                    {" "}
                    {new Date(
                      sale.startTime,
                    ).toLocaleString()}
                  </p>

                  <p>
                    End:
                    {" "}
                    {new Date(
                      sale.endTime,
                    ).toLocaleString()}
                  </p>

                </div>

                <div>

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
                 <Link href={`/flash-sale/edit/${sale._id}`}
>                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
                     Edit
                   </button>
                   </Link>

                <Link href={`/flash-sale/${sale._id}`}   >
                   <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                      Details
                   </button>
                </Link>

              <button
                onClick={() =>
                  handleDelete(
                    sale._id,
                  )
                }
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>
          ),
        )}

      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import api from "@/src/services/api";

type Transaction = {
  _id: string;

  user: {
    phone: string;
    customerType: string;
  };

  order: {
    orderNumber: string;
    totalAmount: number;
  };

  amount: number;
  type: string;
  description: string;
};

export default function RewardTransactionsPage() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/rewards/admin/transactions");

      const list = res?.data || [];

      setData(list);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading Transactions...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Reward Transactions
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Phone</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Order</th>
            <th className="border p-2">Description</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No Transactions Found
              </td>
            </tr>
          ) : (
            data.map((t) => (
              <tr key={t._id} className="text-center">
                <td className="border p-2">
                  {t.user?.phone}
                </td>

                <td className="border p-2">
                  {t.type}
                </td>

                <td className="border p-2">
                  {t.amount}
                </td>

                <td className="border p-2">
                  {t.order?.orderNumber}
                </td>

                <td className="border p-2">
                  {t.description}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
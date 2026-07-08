"use client";

import { useEffect, useState } from "react";
import { getRewardWallets } from "@/src/services/reward.service";

type Wallet = {
  _id: string;

  user: {
    phone: string;
    customerType: string;
  };

  balance: number;

  totalEarned: number;

  totalUsed: number;
};

export default function RewardWalletPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await getRewardWallets();

      console.log("RAW RESPONSE:", res);

      // ✅ IMPORTANT FIX HERE
      const data = res?.data || res?.wallets || res || [];

      setWallets(data);
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading Wallets...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Reward Wallets
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Phone</th>
              <th className="border p-3">Type</th>
              <th className="border p-3">Balance</th>
              <th className="border p-3">Total Earned</th>
              <th className="border p-3">Total Used</th>
            </tr>
          </thead>

          <tbody>
            {wallets.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-5">
                  No Wallet Found
                </td>
              </tr>
            ) : (
              wallets.map((w) => (
                <tr key={w._id} className="text-center">
                  <td className="border p-3">{w.user?.phone}</td>
                  <td className="border p-3">{w.user?.customerType}</td>
                  <td className="border p-3">{w.balance}</td>
                  <td className="border p-3">{w.totalEarned}</td>
                  <td className="border p-3">{w.totalUsed}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
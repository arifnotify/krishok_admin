"use client";

import { deleteBanner, getBanners } from "@/src/services/banner.service";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete Banner?")) return;

    try {
      await deleteBanner(id);
      fetchBanners();
      alert("Banner Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Active এবং Inactive ব্যানার আলাদা করা (এখানে banner.isActive ব্যবহার করা হয়েছে)
  const activeBanners = banners.filter((banner) => banner.isActive);
  const inactiveBanners = banners.filter((banner) => !banner.isActive);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Banners</h1>
        <Link href="/dashboard/banners/create">
          <button className="bg-black text-white px-5 py-3 rounded-xl">
            Create Banner
          </button>
        </Link>
      </div>

      {/* ================= ACTIVE BANNERS SECTION ================= */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Active Banners ({activeBanners.length})
        </h2>

        {activeBanners.length === 0 ? (
          <p className="text-gray-500">No active banners found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {activeBanners.map((banner) => (
              <div
                key={banner._id}
                className="bg-white rounded-xl shadow overflow-hidden border border-green-200"
              >
                <img
                  src={banner.image}
                  alt=""
                  className="w-full h-[180px] object-cover"
                />

                <div className="p-4">
                  <h2 className="font-bold">{banner.title}</h2>
                  <p className="text-green-600 font-medium">Status: Active</p>

                  <div className="flex gap-3 mt-4">
                    <Link href={`/dashboard/banners/edit/${banner._id}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= INACTIVE BANNERS SECTION ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-red-600">
          Inactive Banners ({inactiveBanners.length})
        </h2>

        {inactiveBanners.length === 0 ? (
          <p className="text-gray-500">No inactive banners found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {inactiveBanners.map((banner) => (
              <div
                key={banner._id}
                className="bg-white rounded-xl shadow overflow-hidden border border-red-200 opacity-80"
              >
                <img
                  src={banner.image}
                  alt=""
                  className="w-full h-[180px] object-cover"
                />

                <div className="p-4">
                  <h2 className="font-bold">{banner.title}</h2>
                  <p className="text-red-600 font-medium">Status: Inactive</p>

                  <div className="flex gap-3 mt-4">
                    <Link href={`/dashboard/banners/edit/${banner._id}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

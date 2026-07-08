"use client";

import { deleteBanner, getBanners } from "@/src/services/banner.service";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";



export default function BannersPage() {
  const [banners, setBanners] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners =
    async () => {
      try {
        const data =
          await getBanners();

        setBanners(data);
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
          "Delete Banner?"
        )
      )
        return;

      try {
        await deleteBanner(id);

        fetchBanners();

        alert(
          "Banner Deleted"
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
          Banners
        </h1>

        <Link
          href="/banners/create"
        >
          <button className="bg-black text-white px-5 py-3 rounded-xl">
            Create Banner
          </button>
        </Link>

      </div>

      <div className="grid grid-cols-3 gap-5">

        {banners.map(
          (banner) => (
            <div
              key={banner._id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >

              <img
                src={banner.image}
                alt=""
                className="w-full h-[180px] object-cover"
              />

              <div className="p-4">

                <h2 className="font-bold">
                  {banner.title}
                </h2>

                <p>
                  Status:
                  {" "}
                  {banner.status
                    ? "Active"
                    : "Inactive"}
                </p>

                <div className="flex gap-3 mt-4">

                  <Link
                    href={`/banners/edit/${banner._id}`}
                  >
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(
                        banner._id
                      )
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}
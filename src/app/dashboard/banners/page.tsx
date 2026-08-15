"use client";

import {
  deleteBanner,
  getBanners,
} from "@/src/services/banner.service";

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

  const fetchBanners = async () => {
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

  const handleDelete = async (
    id: string,
  ) => {
    if (
      !confirm("Delete Banner?")
    )
      return;

    try {
      await deleteBanner(id);

      fetchBanners();

      alert(
        "Banner Deleted",
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

  const activeBanners =
    banners.filter(
      (banner) =>
        banner.isActive,
    );

  const inactiveBanners =
    banners.filter(
      (banner) =>
        !banner.isActive,
    );

  const getLinkText = (
    banner: any,
  ) => {
    if (
      banner.linkType ===
      "flashSale"
    ) {
      return "Flash Sale";
    }

    if (
      banner.linkType ===
      "product"
    ) {
      return "Product";
    }

    if (
      banner.linkType ===
      "category"
    ) {
      return "Category";
    }

    return "No Action";
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Banners
        </h1>

        <Link href="/dashboard/banners/create">
          <button className="bg-black text-white px-5 py-3 rounded-xl">
            Create Banner
          </button>
        </Link>
      </div>

      {/* ACTIVE */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Active Banners (
          {
            activeBanners.length
          }
          )
        </h2>

        {activeBanners.length ===
        0 ? (
          <p className="text-gray-500">
            No active banners
            found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {activeBanners.map(
              (banner) => (
                <div
                  key={
                    banner._id
                  }
                  className="bg-white rounded-xl shadow border border-green-200 overflow-hidden"
                >
                  <img
                    src={
                      banner.image
                    }
                    alt=""
                    className="w-full h-[180px] object-cover"
                  />

                  <div className="p-4">

                    <h2 className="font-bold text-lg">
                      {
                        banner.title
                      }
                    </h2>

                    <p className="text-green-600 font-medium mt-1">
                      Status:
                      Active
                    </p>

                    <p className="text-gray-600 text-sm mt-2">
                      Link:
                      {" "}
                      {getLinkText(
                        banner,
                      )}
                    </p>

                    {banner.linkId && (
                      <p className="text-xs text-gray-400 break-all">
                        ID:
                        {" "}
                        {
                          banner.linkId
                        }
                      </p>
                    )}

                    <div className="flex gap-3 mt-4">

                      <Link
                        href={`/dashboard/banners/edit/${banner._id}`}
                      >
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            banner._id,
                          )
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              ),
            )}

          </div>
        )}
      </div>

      {/* INACTIVE */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-red-600">
          Inactive Banners (
          {
            inactiveBanners.length
          }
          )
        </h2>

        {inactiveBanners.length ===
        0 ? (
          <p className="text-gray-500">
            No inactive banners
            found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {inactiveBanners.map(
              (banner) => (
                <div
                  key={
                    banner._id
                  }
                  className="bg-white rounded-xl shadow border border-red-200 opacity-80 overflow-hidden"
                >
                  <img
                    src={
                      banner.image
                    }
                    alt=""
                    className="w-full h-[180px] object-cover"
                  />

                  <div className="p-4">

                    <h2 className="font-bold text-lg">
                      {
                        banner.title
                      }
                    </h2>

                    <p className="text-red-600 font-medium mt-1">
                      Status:
                      Inactive
                    </p>

                    <p className="text-gray-600 text-sm mt-2">
                      Link:
                      {" "}
                      {getLinkText(
                        banner,
                      )}
                    </p>

                    {banner.linkId && (
                      <p className="text-xs text-gray-400 break-all">
                        ID:
                        {" "}
                        {
                          banner.linkId
                        }
                      </p>
                    )}

                    <div className="flex gap-3 mt-4">

                      <Link
                        href={`/dashboard/banners/edit/${banner._id}`}
                      >
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            banner._id,
                          )
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              ),
            )}

          </div>
        )}
      </div>

    </div>
  );
}

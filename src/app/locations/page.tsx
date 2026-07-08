"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { deleteLocation, getLocations } from "@/src/services/location.service";



export default function LocationsPage() {
  const [locations, setLocations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchLocations =
    async () => {
      try {
        const data =
          await getLocations();

        setLocations(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this location?"
      );

    if (!confirmDelete) return;

    await deleteLocation(id);

    fetchLocations();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>

      <div className="flex justify-between mb-5">

        <h1 className="text-3xl font-bold">
          Locations
        </h1>

        <Link
          href="/locations/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Location
        </Link>

      </div>

      <table className="w-full bg-white rounded shadow">

        <thead>

          <tr className="border-b">

            <th className="p-3">
              Division
            </th>

            <th className="p-3">
              District
            </th>

            <th className="p-3">
              Charge
            </th>

            <th className="p-3">
              Status
            </th>

            <th className="p-3">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {locations.map(
            (location: any) => (
              <tr
                key={location._id}
                className="border-b"
              >
                <td className="p-3">
                  {
                    location.division
                  }
                </td>

                <td className="p-3">
                  {
                    location.district
                  }
                </td>

                <td className="p-3">
                  {
                    location.deliveryCharge
                  }{" "}
                  TK
                </td>

                <td className="p-3">
                  {location.isActive
                    ? "Active"
                    : "Inactive"}
                </td>

                <td className="p-3 flex gap-2">

                  <Link
                    href={`/locations/edit/${location._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(
                        location._id
                      )
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getCountries,
  deleteCountry,
} from "@/src/services/country.service";

import { Country } from "@/src/types/country";

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // =========================
  // LOAD COUNTRIES
  // =========================

  const fetchCountries = async () => {
    try {
      setLoading(true);

      const data = await getCountries();

      setCountries(data);
    } catch (error) {
      console.log(error);

      alert("Failed to load countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (
    id: string
  ) => {
    const ok = confirm(
      "Are you sure you want to delete this country?"
    );

    if (!ok) return;

    try {
      await deleteCountry(id);

      setCountries((prev) =>
        prev.filter(
          (country) =>
            country._id !== id
        )
      );

      alert("Country deleted successfully");
    } catch (error) {
      console.log(error);

      alert("Failed to delete country");
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredCountries =
    countries.filter((country) => {
      const keyword =
        search.toLowerCase();

      return (
        country.name
          .toLowerCase()
          .includes(keyword) ||
        country.code
          .toLowerCase()
          .includes(keyword)
      );
    });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-6">
        Loading countries...
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Countries
          </h1>

          <p className="text-gray-500 mt-1">
            Manage product countries
          </p>
        </div>

        <Link
          href="/dashboard/countries/create"
          className="bg-black text-white px-5 py-3 rounded-xl"
        >
          + Add Country
        </Link>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search country..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full border rounded-xl px-5 py-3 mb-6"
      />

      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Flag
              </th>

              <th className="p-4 text-left">
                Country
              </th>

              <th className="p-4 text-left">
                Code
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredCountries.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-500"
                >
                  No countries found
                </td>

              </tr>

            ) : (

              filteredCountries.map(
                (country) => (

                  <tr
                    key={country._id}
                    className="border-t"
                  >

                    {/* FLAG */}

                    <td className="p-4">

                      <img
                        src={country.flag}
                        alt={country.name}
                        className="w-14 h-10 object-cover rounded-lg border"
                      />

                    </td>

                    {/* NAME */}

                    <td className="p-4">

                      <div className="font-semibold">
                        {country.name}
                      </div>

                    </td>

                    {/* CODE */}

                    <td className="p-4">

                      <span className="bg-gray-100 px-3 py-1 rounded-lg font-mono">
                        {country.code}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="p-4">

                      <div className="flex gap-2">

                        <Link
                          href={`/dashboard/countries/edit/${country._id}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              country._id
                            )
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
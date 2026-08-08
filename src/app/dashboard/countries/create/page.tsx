"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createCountry,
} from "@/src/services/country.service";

export default function CreateCountryPage() {

  const router = useRouter();

  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [flag, setFlag] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // CREATE
  // =========================

  const handleCreate = async () => {

    if (!name.trim()) {
      alert("Country name is required");
      return;
    }

    if (!code.trim()) {
      alert("Country code is required");
      return;
    }

    if (!flag.trim()) {
      alert("Flag URL is required");
      return;
    }

    try {

      setLoading(true);

      await createCountry({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        flag: flag.trim(),
      });

      alert(
        "Country created successfully"
      );

      router.push(
        "/dashboard/countries"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to create country"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="max-w-[700px] mx-auto p-6">

      <div className="bg-white rounded-3xl shadow p-8">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Add Country
          </h1>

          <p className="text-gray-500 mt-1">
            Add a new product country
          </p>

        </div>

        <div className="space-y-6">

          {/* NAME */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Country Name
            </label>

            <input
              type="text"
              placeholder="India"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-2xl px-5 py-3.5"
            />

          </div>

          {/* CODE */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Country Code
            </label>

            <input
              type="text"
              placeholder="IN"
              maxLength={3}
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value.toUpperCase()
                )
              }
              className="w-full border rounded-2xl px-5 py-3.5 uppercase"
            />

            <p className="text-xs text-gray-500 mt-2">
              Example: BD, IN, PK, CN, US
            </p>

          </div>

          {/* FLAG */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Flag Image URL
            </label>

            <input
              type="text"
              placeholder="https://example.com/india.png"
              value={flag}
              onChange={(e) =>
                setFlag(e.target.value)
              }
              className="w-full border rounded-2xl px-5 py-3.5"
            />

          </div>

          {/* PREVIEW */}

          {flag && (

            <div>

              <p className="text-sm font-medium mb-2">
                Flag Preview
              </p>

              <div className="border rounded-2xl p-5 inline-block">

                <img
                  src={flag}
                  alt="Flag Preview"
                  className="w-24 h-16 object-cover rounded-xl"
                />

              </div>

            </div>

          )}

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-5">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/countries"
                )
              }
              className="px-6 py-3 border rounded-xl"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded-xl disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Country"}
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}
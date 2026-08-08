"use client";

import { useEffect, useState } from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  getCountry,
  updateCountry,
} from "@/src/services/country.service";

export default function EditCountryPage() {

  const params = useParams();

  const router = useRouter();

  const id = params.id as string;

  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [flag, setFlag] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =========================
  // LOAD COUNTRY
  // =========================

  useEffect(() => {

    const loadCountry =
      async () => {

        try {

          const data =
            await getCountry(id);

          setName(
            data.name || ""
          );

          setCode(
            data.code || ""
          );

          setFlag(
            data.flag || ""
          );

        } catch (error) {

          console.log(error);

          alert(
            "Failed to load country"
          );

          router.push(
            "/dashboard/countries"
          );

        } finally {

          setLoading(false);

        }

      };

    if (id) {
      loadCountry();
    }

  }, [id, router]);

  // =========================
  // UPDATE
  // =========================

  const handleUpdate = async () => {

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

      setSaving(true);

      await updateCountry(
        id,
        {
          name: name.trim(),
          code: code.trim().toUpperCase(),
          flag: flag.trim(),
        }
      );

      alert(
        "Country updated successfully"
      );

      router.push(
        "/dashboard/countries"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to update country"
      );

    } finally {

      setSaving(false);

    }

  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="p-6">
        Loading country...
      </div>
    );

  }

  // =========================
  // UI
  // =========================

  return (

    <div className="max-w-[700px] mx-auto p-6">

      <div className="bg-white rounded-3xl shadow p-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Edit Country
          </h1>

          <p className="text-gray-500 mt-1">
            Update country information
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
              maxLength={3}
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value.toUpperCase()
                )
              }
              className="w-full border rounded-2xl px-5 py-3.5 uppercase"
            />

          </div>

          {/* FLAG */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Flag Image URL
            </label>

            <input
              type="text"
              value={flag}
              onChange={(e) =>
                setFlag(e.target.value)
              }
              className="w-full border rounded-2xl px-5 py-3.5"
            />

          </div>

          {/* FLAG PREVIEW */}

          {flag && (

            <div>

              <p className="text-sm font-medium mb-2">
                Flag Preview
              </p>

              <div className="border rounded-2xl p-5 inline-block">

                <img
                  src={flag}
                  alt={name}
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
              onClick={handleUpdate}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50"
            >
              {saving
                ? "Updating..."
                : "Update Country"}
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}
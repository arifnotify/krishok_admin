"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getCountry,
  updateCountry,
} from "@/src/services/country.service";

import { uploadImages } from "@/src/services/upload.service";

export default function EditCountryPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  // =========================
  // STATES
  // =========================

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [flag, setFlag] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD COUNTRY
  // =========================

  useEffect(() => {
    if (!id) return;

    const loadCountry = async () => {
      try {
        const data = await getCountry(id);

        setName(data.name || "");
        setCode(data.code || "");
        setFlag(data.flag || "");
      } catch (error) {
        console.log(error);

        alert("Failed to load country");

        router.push("/dashboard/countries");
      } finally {
        setLoading(false);
      }
    };

    loadCountry();
  }, [id, router]);

  // =========================
  // UPLOAD FLAG TO CLOUDINARY
  // =========================

  const handleFlagUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Image validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      e.target.value = "";
      return;
    }

    // Optional size validation: 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      // IMPORTANT:
      // uploadImages expects FileList
      const fileList = e.target.files;

      if (!fileList) return;

      const result = await uploadImages(fileList);

      console.log("Cloudinary Upload Result:", result);

      if (!result || result.length === 0) {
        throw new Error("Image upload failed");
      }

      // First uploaded image URL
      const uploadedUrl = result[0].url;

      if (!uploadedUrl) {
        throw new Error("Cloudinary URL not found");
      }

      // Set Cloudinary URL
      setFlag(uploadedUrl);

      alert("Flag image uploaded successfully");
    } catch (error) {
      console.log("Flag upload error:", error);

      alert("Failed to upload flag image");
    } finally {
      setUploading(false);

      // Reset input
      e.target.value = "";
    }
  };

  // =========================
  // UPDATE COUNTRY
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
      alert("Flag image is required");
      return;
    }

    try {
      setSaving(true);

      await updateCountry(id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        flag: flag.trim(),
      });

      alert("Country updated successfully");

      router.push("/dashboard/countries");
    } catch (error) {
      console.log("Update country error:", error);

      alert("Failed to update country");
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
        <div className="max-w-[700px] mx-auto">
          <div className="bg-white rounded-3xl shadow p-8">
            <p className="text-gray-500">
              Loading country...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="max-w-[700px] mx-auto p-6">
      <div className="bg-white rounded-3xl shadow p-8">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Edit Country
          </h1>

          <p className="text-gray-500 mt-1">
            Update country information
          </p>
        </div>

        <div className="space-y-6">

          {/* =========================
              COUNTRY NAME
          ========================= */}

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
              className="w-full border rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* =========================
              COUNTRY CODE
          ========================= */}

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
                  e.target.value
                    .replace(/[^a-zA-Z]/g, "")
                    .toUpperCase()
                )
              }
              className="w-full border rounded-2xl px-5 py-3.5 uppercase outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-500 mt-2">
              Example: BD, IN, PK, CN, US
            </p>
          </div>

          {/* =========================
              FLAG IMAGE
          ========================= */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Country Flag
            </label>

            <div className="border-2 border-dashed rounded-2xl p-6">

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleFlagUpload}
                disabled={uploading || saving}
                className="w-full"
              />

              <p className="text-xs text-gray-500 mt-2">
                Select a flag image. It will be uploaded to Cloudinary.
              </p>

            </div>
          </div>

          {/* =========================
              UPLOADING
          ========================= */}

          {uploading && (
            <div className="border rounded-2xl p-4 bg-blue-50">
              <div className="flex items-center gap-3">

                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />

                <p className="text-sm text-blue-700">
                  Uploading flag to Cloudinary...
                </p>

              </div>
            </div>
          )}

          {/* =========================
              FLAG PREVIEW
          ========================= */}

          {flag && !uploading && (
            <div>

              <p className="text-sm font-medium mb-2">
                Flag Preview
              </p>

              <div className="border rounded-2xl p-5 inline-block">

                <img
                  src={flag}
                  alt={name || "Country Flag"}
                  className="w-32 h-20 object-cover rounded-xl border"
                />

              </div>

              <p className="text-xs text-gray-400 mt-2 break-all">
                {flag}
              </p>

            </div>
          )}

          {/* =========================
              BUTTONS
          ========================= */}

          <div className="flex justify-end gap-3 pt-5">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/countries"
                )
              }
              disabled={saving || uploading}
              className="px-6 py-3 border rounded-xl disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={
                saving ||
                uploading ||
                !name.trim() ||
                !code.trim() ||
                !flag.trim()
              }
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
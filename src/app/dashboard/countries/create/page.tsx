"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createCountry } from "@/src/services/country.service";
import { uploadImages } from "@/src/services/upload.service";

export default function CreateCountryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [flag, setFlag] = useState("");

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // FLAG IMAGE UPLOAD
  // =========================

  const handleFlagUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      // =========================
      // UPLOAD TO CLOUDINARY
      // =========================

      const result = await uploadImages([file]);

      console.log(
        "Cloudinary Upload Result:",
        result
      );

      if (
        !result ||
        !Array.isArray(result) ||
        !result[0]?.url
      ) {
        throw new Error(
          "Cloudinary URL not found"
        );
      }

      // Cloudinary URL
      const imageUrl = result[0].url;

      setFlag(imageUrl);

    } catch (error) {
      console.error(
        "Flag upload error:",
        error
      );

      alert(
        "Flag image upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // REMOVE FLAG
  // =========================

  const removeFlag = () => {
    setFlag("");
  };

  // =========================
  // CREATE COUNTRY
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

    if (!flag) {
      alert("Please upload country flag");
      return;
    }

    try {
      setLoading(true);

      await createCountry({
        name: name.trim(),

        code: code
          .trim()
          .toUpperCase(),

        flag: flag,
      });

      alert(
        "Country created successfully"
      );

      router.push(
        "/dashboard/countries"
      );

    } catch (error) {
      console.error(
        "Create country error:",
        error
      );

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

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Add Country
          </h1>

          <p className="text-gray-500 mt-1">
            Add a new product country
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
              className="
                w-full
                border
                rounded-2xl
                px-5
                py-3.5
                outline-none
                focus:ring-2
                focus:ring-black
              "
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
                    .replace(
                      /[^a-zA-Z]/g,
                      ""
                    )
                    .toUpperCase()
                )
              }
              className="
                w-full
                border
                rounded-2xl
                px-5
                py-3.5
                uppercase
                outline-none
                focus:ring-2
                focus:ring-black
              "
            />

            <p className="text-xs text-gray-500 mt-2">
              Example: BD, IN, PK, CN, US
            </p>

          </div>

          {/* =========================
              FLAG UPLOAD
          ========================= */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Country Flag
            </label>

            {!flag ? (

              <label
                htmlFor="flag-upload"
                className="
                  border-2
                  border-dashed
                  rounded-2xl
                  p-8
                  flex
                  flex-col
                  items-center
                  justify-center
                  cursor-pointer
                  hover:bg-gray-50
                  transition
                "
              >

                <div className="text-4xl mb-3">
                  🏳️
                </div>

                <p className="font-medium">
                  Click to upload flag
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG or WEBP — Max 5MB
                </p>

                <input
                  id="flag-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFlagUpload}
                  className="hidden"
                />

              </label>

            ) : (

              <div
                className="
                  border
                  rounded-2xl
                  p-5
                "
              >

                {/* PREVIEW */}

                <div className="flex items-center gap-5">

                  <img
                    src={flag}
                    alt="Country Flag"
                    className="
                      w-32
                      h-20
                      object-cover
                      rounded-xl
                      border
                    "
                  />

                  <div>

                    <p className="font-medium">
                      Flag uploaded
                    </p>

                    <p className="text-sm text-green-600">
                      Cloudinary upload successful
                    </p>

                    <button
                      type="button"
                      onClick={removeFlag}
                      disabled={uploading}
                      className="
                        mt-2
                        text-sm
                        text-red-600
                        hover:underline
                      "
                    >
                      Remove Flag
                    </button>

                  </div>

                </div>

              </div>

            )}

            {/* UPLOADING */}

            {uploading && (
              <p className="text-sm text-blue-600 mt-3">
                Uploading flag to Cloudinary...
              </p>
            )}

          </div>

          {/* =========================
              PREVIEW
          ========================= */}

          {flag && (

            <div>

              <p className="text-sm font-medium mb-2">
                Country Preview
              </p>

              <div
                className="
                  border
                  rounded-2xl
                  p-4
                  flex
                  items-center
                  gap-4
                "
              >

                <img
                  src={flag}
                  alt={name || "Country"}
                  className="
                    w-16
                    h-10
                    object-cover
                    rounded-md
                    border
                  "
                />

                <div>

                  <p className="font-semibold">
                    {name || "Country Name"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {code || "CODE"}
                  </p>

                </div>

              </div>

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
              disabled={
                loading ||
                uploading
              }
              className="
                px-6
                py-3
                border
                rounded-xl
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={
                loading ||
                uploading
              }
              className="
                px-6
                py-3
                bg-black
                text-white
                rounded-xl
                disabled:opacity-50
              "
            >
              {uploading
                ? "Uploading..."
                : loading
                ? "Creating..."
                : "Create Country"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
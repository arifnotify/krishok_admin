"use client";

import { useState } from "react";

import {
  createCountry,
  updateCountry,
} from "../../services/country.service";

import { Country } from "../../types/country";

interface CountryFormProps {
  country?: Country;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function CountryForm({
  country,
  onSuccess,
  onCancel,
}: CountryFormProps) {
  const isEdit = !!country;

  const [name, setName] = useState(
    country?.name || "",
  );

  const [code, setCode] = useState(
    country?.code || "",
  );

  const [flag, setFlag] = useState(
    country?.flag || "",
  );

  const [preview, setPreview] = useState(
    country?.flag || "",
  );

  const [uploading, setUploading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  // ===============================
  // CLOUDINARY UPLOAD
  // ===============================

  const uploadToCloudinary = async (
    file: File,
  ) => {
    const cloudName =
      process.env
        .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const uploadPreset =
      process.env
        .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary configuration missing",
      );
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "upload_preset",
      uploadPreset,
    );

    formData.append(
      "folder",
      "attin/countries",
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(
        "Cloudinary upload failed",
      );
    }

    const data = await response.json();

    return data.secure_url;
  };


  // ===============================
  // FLAG SELECT
  // ===============================

  const handleFlagChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file.",
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Flag image must be less than 2MB.",
      );
      return;
    }

    try {
      setError("");
      setUploading(true);

      const localPreview =
        URL.createObjectURL(file);

      setPreview(localPreview);

      const url =
        await uploadToCloudinary(file);

      setFlag(url);

    } catch (error: any) {
      console.error(error);

      setError(
        error?.message ||
          "Failed to upload flag.",
      );

      setPreview(
        country?.flag || "",
      );

    } finally {
      setUploading(false);
    }
  };


  // ===============================
  // SAVE COUNTRY
  // ===============================

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    try {
      setError("");

      if (!name.trim()) {
        setError(
          "Country name is required.",
        );
        return;
      }

      if (!code.trim()) {
        setError(
          "Country code is required.",
        );
        return;
      }

      if (!flag) {
        setError(
          "Please upload a flag.",
        );
        return;
      }

      setSaving(true);

      const payload = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        flag,
      };

      if (isEdit) {
        await updateCountry(
          country!._id,
          payload,
        );
      } else {
        await createCountry(
          payload,
        );
      }

      onSuccess();

    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to save country.",
      );

    } finally {
      setSaving(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* COUNTRY NAME */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Country Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="India"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />
      </div>


      {/* COUNTRY CODE */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Country Code
        </label>

        <input
          type="text"
          value={code}
          maxLength={3}
          onChange={(e) =>
            setCode(
              e.target.value
                .toUpperCase(),
            )
          }
          placeholder="IN"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 uppercase outline-none focus:border-black"
        />

        <p className="mt-1 text-xs text-gray-500">
          Example: BD, IN, PK, CN
        </p>
      </div>


      {/* FLAG */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Country Flag
        </label>

        <div className="rounded-xl border-2 border-dashed border-gray-300 p-6">

          {preview && (
            <div className="mb-5 flex justify-center">
              <div className="overflow-hidden rounded-lg border bg-gray-50 p-2">
                <img
                  src={preview}
                  alt="Flag preview"
                  className="h-24 w-36 object-cover"
                />
              </div>
            </div>
          )}

          <label className="flex cursor-pointer flex-col items-center justify-center">

            <div className="mb-2 text-3xl">
              🏳️
            </div>

            <span className="text-sm font-medium text-gray-700">
              {uploading
                ? "Uploading..."
                : "Choose Flag Image"}
            </span>

            <span className="mt-1 text-xs text-gray-500">
              PNG, JPG or WEBP — Max 2MB
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={
                handleFlagChange
              }
              disabled={uploading}
              className="hidden"
            />

          </label>

        </div>
      </div>


      {/* BUTTONS */}

      <div className="flex justify-end gap-3">

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={
            saving || uploading
          }
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEdit
            ? "Update Country"
            : "Save Country"}
        </button>

      </div>

    </form>
  );
}
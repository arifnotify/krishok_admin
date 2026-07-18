"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getCategory,
  updateCategory,
} from "@/src/services/category.service";

import {
  uploadImage,
} from "@/src/services/upload.service";

export default function EditMainCategoryPage() {
  const params = useParams();
  const id = params?.id as string;

  const [name, setName] =
    useState("");

  const [image, setImage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOAD CATEGORY
  // =========================
  useEffect(() => {
    if (id) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      const res = await getCategory(id);

      console.log("CATEGORY:", res);

      setName(res.name || "");
      setImage(res.image || "");
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const res = await uploadImage(file);

      console.log("UPLOAD:", res);

      // SAFE RESPONSE HANDLING
      const url = res.url || res.data?.url;

      setImage(url);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // UPDATE CATEGORY
  // =========================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateCategory(id, {
        name,
        image,
        parentCategory: null,
      });

      alert("Category Updated Successfully");

      window.location.href = "/dashboard/categories";
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <div className="bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">
          Edit Main Category
        </h1>

        {/* NAME */}
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border p-3 rounded-lg mb-5"
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          onChange={handleUpload}
          className="mb-4"
        />

        {/* IMAGE PREVIEW */}
        {image && (
          <div className="mt-4">
            <img
              src={image}
              className="w-32 h-32 object-cover rounded-lg border"
            />

            {/* REMOVE IMAGE */}
            <button
              type="button"
              onClick={() => setImage("")}
              className="bg-red-500 text-white px-4 py-2 rounded mt-3"
            >
              Remove Image
            </button>
          </div>
        )}

        {/* UPDATE BUTTON */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg mt-6 w-full"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>

      </div>

    </div>
  );
}

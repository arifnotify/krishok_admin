"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getCategory,
  updateCategory,
  getMainCategories,
} from "@/src/services/category.service";

import {
  uploadImage,
} from "@/src/services/upload.service";

export default function EditSubCategoryPage() {
  const params = useParams();
  const id = params?.id as string;

  const [name, setName] =
    useState("");

  const [image, setImage] =
    useState("");

  const [parentCategory, setParentCategory] =
    useState("");

  const [categories, setCategories] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    if (id) {
      loadCategory();
      loadMainCategories();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      const res = await getCategory(id);

      console.log("SUB CATEGORY:", res);

      setName(res.name || "");
      setImage(res.image || "");
      setParentCategory(
        res.parentCategory?._id || res.parentCategory || ""
      );
    } catch (error) {
      console.log(error);
    }
  };

  const loadMainCategories = async () => {
    try {
      const res = await getMainCategories();
      setCategories(res);
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

      const url = res.url || res.data?.url;

      setImage(url);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateCategory(id, {
        name,
        image,
        parentCategory,
      });

      alert("Sub Category Updated");

      window.location.href = "/categories";
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
          Edit Sub Category
        </h1>

        {/* NAME */}
        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Sub Category Name"
        />

        {/* MAIN CATEGORY SELECT */}
        <select
          value={parentCategory}
          onChange={(e) =>
            setParentCategory(e.target.value)
          }
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="">
            Select Main Category
          </option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

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
          className="bg-green-600 text-white px-5 py-3 rounded-lg mt-6 w-full"
        >
          {loading ? "Updating..." : "Update Sub Category"}
        </button>

      </div>

    </div>
  );
}
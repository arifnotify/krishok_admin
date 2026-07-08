"use client";

import { useEffect, useState } from "react";

import {
  getMainCategories,
  createCategory,
} from "@/src/services/category.service";

import {
  uploadImage,
} from "@/src/services/upload.service";

export default function CreateSubCategoryPage() {
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

  // LOAD MAIN CATEGORIES
  useEffect(() => {
    loadMainCategories();
  }, []);

  const loadMainCategories =
    async () => {
      try {
        const res =
          await getMainCategories();

        setCategories(res);
      } catch (error) {
        console.log(error);
      }
    };

  // IMAGE UPLOAD
  const handleUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      try {
        const res =
          await uploadImage(
            file,
          );

        setImage(
          res.url,
        );
      } catch (error) {
        console.log(error);
      }
    };

  // CREATE SUB CATEGORY
  const handleCreate =
    async () => {
      try {
        setLoading(true);

        await createCategory({
          name,
          image,
          parentCategory,
        });

        alert(
          "Sub Category Created Successfully",
        );

        window.location.href =
          "/categories";
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="p-6">

      <div className="bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">
          Create Sub Category
        </h1>

        {/* NAME */}
        <input
          type="text"
          placeholder="Sub Category Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value,
            )
          }
          className="w-full border p-3 rounded-lg mb-4"
        />

        {/* MAIN CATEGORY SELECT */}
        <select
          value={
            parentCategory
          }
          onChange={(e) =>
            setParentCategory(
              e.target.value,
            )
          }
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="">
            Select Main Category
          </option>

          {categories.map(
            (cat) => (
              <option
                key={
                  cat._id
                }
                value={
                  cat._id
                }
              >
                {cat.name}
              </option>
            ),
          )}
        </select>

        {/* IMAGE */}
        <input
          type="file"
          onChange={
            handleUpload
          }
        />

        {image && (
          <img
            src={image}
            className="w-32 h-32 object-cover rounded-lg mt-4"
          />
        )}

        {/* BUTTON */}
        <button
          onClick={
            handleCreate
          }
          disabled={
            loading
          }
          className="bg-green-600 text-white px-5 py-3 rounded-lg mt-6"
        >
          {loading
            ? "Creating..."
            : "Create Sub Category"}
        </button>

      </div>

    </div>
  );
}
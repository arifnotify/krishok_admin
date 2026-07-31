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
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [image, setImage] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  // LOAD MAIN CATEGORIES
  useEffect(() => {
    loadMainCategories();
  }, []);

  const loadMainCategories = async () => {
    try {
      const res = await getMainCategories();
      setCategories(res);
    } catch (error) {
      console.log(error);
    }
  };

  // IMAGE UPLOAD
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadImage(file);
      setImage(res.url);
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE SUB CATEGORY
  const handleCreate = async () => {
    try {
      setLoading(true);

      await createCategory({
        name: {
          en: nameEn,
          bn: nameBn,
        },
        image,
        parentCategory,
        sortOrder,
      });

      alert("Sub Category Created Successfully");
      window.location.href = "/dashboard/categories";
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-xl shadow max-w-xl">
        <h1 className="text-2xl font-bold mb-6">
          Create Sub Category
        </h1>

        {/* NAME EN */}
        <input
          type="text"
          placeholder="Sub Category Name (English)"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        {/* NAME BN */}
        <input
          type="text"
          placeholder="সাব-ক্যাটাগরির নাম (বাংলা)"
          value={nameBn}
          onChange={(e) => setNameBn(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        {/* MAIN CATEGORY SELECT */}
        <select
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="">
            Select Main Category
          </option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name?.en || cat.name}
            </option>
          ))}
        </select>
        <div className="mb-4">
  <label className="block font-medium mb-2">
    Sort Order
  </label>

  <input
    type="number"
    value={sortOrder}
    onChange={(e) =>
      setSortOrder(Number(e.target.value))
    }
    className="w-full border p-3 rounded-lg"
  />
</div>

        {/* IMAGE */}
        <input
          type="file"
          onChange={handleUpload}
          className="mb-4"
        />

        {image && (
          <img
            src={image}
            className="w-32 h-32 object-cover rounded-lg mt-2"
          />
        )}

        {/* BUTTON */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-600 text-white px-5 py-3 rounded-lg mt-6 block w-full"
        >
          {loading ? "Creating..." : "Create Sub Category"}
        </button>
      </div>
    </div>
  );
}

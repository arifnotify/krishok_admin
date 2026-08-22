"use client";

import { useEffect, useState } from "react";
import {
  getCategories, // সব ক্যাটাগরি ফেচ করার জন্য (যাতে যেকোনো ক্যাটাগরির নিচে সাব-ক্যাটাগরি বানানো যায়)
  createCategory,
} from "@/src/services/category.service";
import {
  uploadImage,
} from "@/src/services/upload.service";

export default function CreateSubCategoryPage() {
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [image, setImage] = useState(""); // সাব-ক্যাটাগরির ছবি
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  // LOAD ALL CATEGORIES (ট্রি বা লিস্ট আকারে দেখানোর জন্য)
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(Array.isArray(res) ? res : []);
    } catch (error) {
      console.log(error);
    }
  };

  // IMAGE UPLOAD (প্রতিটি সাব-ক্যাটাগরির জন্য আলাদা ছবি আপলোড)
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const res = await uploadImage(file);
      const url = res.url || res.data?.url;
      setImage(url);
    } catch (error) {
      console.log(error);
      alert("Image Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  // CREATE SUB CATEGORY
  const handleCreate = async () => {
    if (!nameEn || !nameBn) {
      alert("Please fill in both English and Bangla names.");
      return;
    }

    if (!parentCategory) {
      alert("Please select a Parent Category.");
      return;
    }

    try {
      setLoading(true);

      await createCategory({
        name: {
          en: nameEn,
          bn: nameBn,
        },
        image, // সাব-ক্যাটাগরির ছবি ডেটাবেজে সেভ হবে
        parentCategory,
        sortOrder,
        showOnHome: false,
        isActive: true,
      });

      alert("Sub Category Created Successfully");
      window.location.href = "/dashboard/categories";
    } catch (error) {
      console.log(error);
      alert("Creation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow">
        <h1 className="text-2xl font-bold mb-6">
          Create Sub Category
        </h1>

        {/* NAME EN */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Sub Category Name (English)</label>
          <input
            type="text"
            placeholder="e.g. Fresh Fish"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full border p-3.5 rounded-2xl"
          />
        </div>

        {/* NAME BN */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">সাব-ক্যাটাগরির নাম (বাংলা)</label>
          <input
            type="text"
            placeholder="যেমন: তাজা মাছ"
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
            className="w-full border p-3.5 rounded-2xl"
          />
        </div>

        {/* PARENT CATEGORY SELECT */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Parent Category</label>
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
            className="w-full border p-3.5 rounded-2xl"
          >
            <option value="">
              Select Parent Category
            </option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name?.en || cat.name} ({cat.name?.bn})
              </option>
            ))}
          </select>
        </div>

        {/* SORT ORDER */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Sort Order
          </label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full border p-3.5 rounded-2xl"
            placeholder="0"
          />
        </div>

        {/* IMAGE UPLOAD FOR SUB CATEGORY */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Sub Category Image
          </label>
          <input 
            type="file" 
            onChange={handleUpload} 
            className="w-full border p-3 rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
          />

          {image && (
            <div className="mt-4 relative w-32 h-32">
              <img
                src={image}
                alt="Subcategory Preview"
                className="w-full h-full object-cover rounded-2xl border shadow-sm"
              />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg transition"
        >
          {loading ? "Creating..." : "Create Sub Category"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getCategory,
  updateCategory,
  getMainCategories,
} from "@/src/services/category.service";
import { uploadImage } from "@/src/services/upload.service";

export default function EditSubCategoryPage() {
  const params = useParams();
  const id = params?.id as string;

  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [image, setImage] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (id) {
      loadCategory();
      loadMainCategories();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      const res = await getCategory(id);
      setNameEn(res.name?.en || res.name || "");
      setNameBn(res.name?.bn || "");
      setImage(res.image || "");
      setSortOrder(res.sortOrder || 0);
      setParentCategory(
        res.parentCategory?._id || res.parentCategory || ""
      );
      setIsActive(res.isActive ?? true);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMainCategories = async () => {
    try {
      const res = await getMainCategories();
      // নিজের আইডি বাদ দেওয়া যেতে পারে যাতে সাব-ক্যাটাগরি নিজের প্যারেন্ট নিজে হতে না পারে
      const filteredCategories = res.filter((cat: any) => cat._id !== id);
      setCategories(filteredCategories);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateCategory(id, {
        name: {
          en: nameEn,
          bn: nameBn,
        },
        image,
        parentCategory,
        sortOrder,
        isActive,
      });

      alert("Sub Category Updated Successfully");
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
        <h1 className="text-2xl font-bold mb-6">Edit Sub Category</h1>

        {/* NAME EN */}
        <input
          type="text"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Sub Category Name (English)"
        />

        {/* NAME BN */}
        <input
          type="text"
          value={nameBn}
          onChange={(e) => setNameBn(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="সাব-ক্যাটাগরির নাম (বাংলা)"
        />

        {/* MAIN CATEGORY SELECT */}
        <select
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="">Select Main Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name?.en || cat.name}
            </option>
          ))}
        </select>

        {/* SORT ORDER */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Sort Order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* ACTIVE / INACTIVE */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5"
          />
          <label className="font-medium">
            {isActive ? "Category Active" : "Category Inactive"}
          </label>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Category Image</label>
          <input type="file" onChange={handleUpload} />
        </div>

        {image && (
          <div className="mt-4 mb-4">
            <img
              src={image}
              alt="Category"
              className="w-32 h-32 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => setImage("")}
              className="bg-red-500 text-white px-4 py-2 rounded mt-3 block"
            >
              Remove Image
            </button>
          </div>
        )}

        {/* UPDATE BUTTON */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg mt-6 w-full font-medium"
        >
          {loading ? "Updating..." : "Update Sub Category"}
        </button>
      </div>
    </div>
  );
}

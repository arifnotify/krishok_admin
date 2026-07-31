"use client";

import { useState } from "react";
import { createCategory } from "@/src/services/category.service";
import { uploadImage } from "@/src/services/upload.service";

export default function CreateMainCategoryPage() {
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [image, setImage] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await uploadImage(file);
    setImage(res.url);
  };

  const handleCreate = async () => {
    await createCategory({
      name: {
        en: nameEn,
        bn: nameBn,
      },
      image,
      parentCategory: null,
      sortOrder,
    });

    alert("Created Successfully");
    window.location.href = "/dashboard/categories";
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-xl shadow max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Create Main Category</h1>

        <input
          type="text"
          placeholder="Category Name (English)"
          className="border p-3 rounded w-full mb-4"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />

        <input
          type="text"
          placeholder="ক্যাটাগরির নাম (বাংলা)"
          className="border p-3 rounded w-full mb-4"
          value={nameBn}
          onChange={(e) => setNameBn(e.target.value)}
        />

        <input type="file" onChange={handleUpload} className="mb-4" />

        {image && (
          <img src={image} className="w-32 h-32 mt-2 rounded-lg object-cover" />
        )}

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
          placeholder="1"
        />
      </div>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg mt-5 block"
        >
          Create
        </button>
      </div>
    </div>
  );
}

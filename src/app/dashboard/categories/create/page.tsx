"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
} from "@/src/services/category.service";

export default function CreateCategoryPage() {
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [type, setType] = useState<"main" | "sub">("main");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleCreate = async () => {
    await createCategory({
      name: {
        en: nameEn,
        bn: nameBn,
      },
      parentId: type === "main" ? null : parentId,
      sortOrder,
    });

    alert("Created Successfully");
    window.location.href = "/dashboard/categories";
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Create Category</h1>

      {/* NAME EN */}
      <input
        className="w-full border p-3 mb-3"
        placeholder="Category Name (English)"
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
      />

      {/* NAME BN */}
      <input
        className="w-full border p-3 mb-3"
        placeholder="ক্যাটাগরির নাম (বাংলা)"
        value={nameBn}
        onChange={(e) => setNameBn(e.target.value)}
      />
    {/* number */}
      <input
  type="number"
  className="w-full border p-3 mb-3"
  placeholder="Sort Order"
  value={sortOrder}
  onChange={(e) =>
    setSortOrder(Number(e.target.value))
  }
/>

      {/* TYPE */}
      <select
        className="w-full border p-3 mb-3"
        value={type}
        onChange={(e) => setType(e.target.value as any)}
      >
        <option value="main">Main Category</option>
        <option value="sub">Sub Category</option>
      </select>

      {type === "sub" && (
        <select
          className="w-full border p-3 mb-3"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option value="">Select Main Category</option>
          {categories
            .filter((c) => !c.parentId)
            .map((c) => (
              <option key={c._id} value={c._id}>
                {c.name?.en || c.name}
              </option>
            ))}
        </select>
      )}

      <button
        onClick={handleCreate}
        className="bg-black text-white px-4 py-2"
      >
        Create
      </button>
    </div>
  );
}

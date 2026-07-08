"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
} from "@/src/services/category.service";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState<"main" | "sub">("main");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleCreate = async () => {
    await createCategory({
      name,
      parentId: type === "main" ? null : parentId,
    });

    alert("Created Successfully");

    // IMPORTANT: refresh
    window.location.href = "/categories";
  };

  return (
    <div className="p-6 max-w-xl">

      <h1 className="text-2xl font-bold mb-4">
        Create Category
      </h1>

      {/* NAME */}
      <input
        className="w-full border p-3 mb-3"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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

      {/* PARENT ONLY FOR SUB */}
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
                {c.name}
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
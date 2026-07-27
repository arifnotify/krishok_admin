"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  updateCategory,
} from "@/src/services/category.service";
import api from "@/src/services/api";
import { useParams } from "next/navigation";

export default function EditCategoryPage() {
  const { id } = useParams();

  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [type, setType] = useState<"main" | "sub">("main");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [cats, res] = await Promise.all([
      getCategories(),
      api.get(`/dashboard/categories/${id}`),
    ]);

    setCategories(cats);

    setNameEn(res.data.name?.en || res.data.name || "");
    setNameBn(res.data.name?.bn || "");

    if (res.data.parentId) {
      setType("sub");
      setParentId(res.data.parentId);
    } else {
      setType("main");
    }
  };

  const handleUpdate = async () => {
    await updateCategory(id as string, {
      name: {
        en: nameEn,
        bn: nameBn,
      },
      parentId: type === "main" ? null : parentId,
    });

    alert("Updated");
    window.location.href = "/dashboard/categories";
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>

      <input
        className="w-full border p-3 mb-3"
        placeholder="Category Name (English)"
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
      />

      <input
        className="w-full border p-3 mb-3"
        placeholder="ক্যাটাগরির নাম (বাংলা)"
        value={nameBn}
        onChange={(e) => setNameBn(e.target.value)}
      />

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
          <option value="">Select Main</option>
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
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Update
      </button>
    </div>
  );
}

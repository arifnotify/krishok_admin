"use client";

import { useState } from "react";

import {
  createCategory,
} from "@/src/services/category.service";

import {
  uploadImage,
} from "@/src/services/upload.service";

export default function CreateMainCategoryPage() {

  const [name, setName] =
    useState("");

  const [image, setImage] =
    useState("");

  const handleUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const res =
        await uploadImage(
          file,
        );

      setImage(
        res.url,
      );
    };

  const handleCreate =
    async () => {
      await createCategory({
        name,
        image,
        parentCategory:
          null,
      });

      alert(
        "Created Successfully",
      );

      window.location.href =
        "/categories";
    };

  return (
    <div className="p-6">

      <div className="bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">
          Create Main Category
        </h1>

        <input
          type="text"
          placeholder="Category Name"
          className="border p-3 rounded w-full mb-4"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value,
            )
          }
        />

        <input
          type="file"
          onChange={
            handleUpload
          }
        />

        {image && (
          <img
            src={image}
            className="w-32 h-32 mt-4 rounded-lg object-cover"
          />
        )}

        <button
          onClick={
            handleCreate
          }
          className="bg-blue-600 text-white px-5 py-3 rounded-lg mt-5"
        >
          Create
        </button>

      </div>

    </div>
  );
}
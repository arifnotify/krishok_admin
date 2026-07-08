"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/src/services/upload.service";
import { createBanner } from "@/src/services/banner.service";


export default function CreateBannerPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("/products");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);

  // IMAGE UPLOAD
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadImage(file);

      console.log("UPLOAD RESPONSE:", res);

      const imageUrl =
        res.url ||
        res.imageUrl ||
        res.secure_url ||
        res.data?.url ||
        res.data?.imageUrl;

      setImage(imageUrl);
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    }
  };

  // CREATE BANNER
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload image first");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title,
        image,
        link,
        isActive,
      };

      console.log("FINAL PAYLOAD:", payload);

      await createBanner(payload);

      alert("Banner Created Successfully");

      router.push("/banners");
    } catch (err: any) {
      console.log("ERROR:", err?.response?.data || err);
      alert(
        err?.response?.data?.message ||
          "Create Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Create Banner
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TITLE */}
        <input
          type="text"
          placeholder="Banner Title"
          className="border p-3 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* LINK */}
        <input
          type="text"
          placeholder="Link (e.g /products)"
          className="border p-3 w-full rounded"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {/* IMAGE */}
        <input
          type="file"
          onChange={handleUpload}
        />

        {image && (
          <img
            src={image}
            className="w-full h-[200px] object-cover rounded"
          />
        )}

        {/* ACTIVE STATUS */}
        <select
          value={String(isActive)}
          onChange={(e) =>
            setIsActive(e.target.value === "true")
          }
          className="border p-3 w-full rounded"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded w-full"
        >
          {loading ? "Creating..." : "Create Banner"}
        </button>

      </form>

    </div>
  );
}
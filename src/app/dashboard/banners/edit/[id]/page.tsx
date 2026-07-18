"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/src/services/api";
import { uploadImage } from "@/src/services/upload.service";
import { updateBanner } from "@/src/services/banner.service";



export default function EditBannerPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("/products");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);

  // FETCH SINGLE BANNER
  const fetchBanner = async () => {
    try {
      const res = await api.get(`/banners/${id}`);

      console.log("BANNER DATA:", res.data);

      setTitle(res.data.title);
      setImage(res.data.image);
      setLink(res.data.link || "/products");
      setIsActive(res.data.isActive);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) fetchBanner();
  }, [id]);

  // IMAGE UPLOAD
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadImage(file);

      const imageUrl =
        res.url ||
        res.imageUrl ||
        res.secure_url ||
        res.data?.url ||
        res.data?.imageUrl;

      setImage(imageUrl);
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE BANNER
  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title,
        image,
        link,
        isActive,
      };

      console.log("UPDATE PAYLOAD:", payload);

      await updateBanner(id as string, payload);

      alert("Banner Updated Successfully");

      router.push("/banners");
    } catch (err: any) {
      console.log(err?.response?.data || err);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Edit Banner
      </h1>

      <form onSubmit={handleUpdate} className="space-y-4">

        {/* TITLE */}
        <input
          type="text"
          className="border p-3 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* LINK */}
        <input
          type="text"
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

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded w-full"
        >
          {loading ? "Updating..." : "Update Banner"}
        </button>

      </form>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/src/services/api";
import { uploadImage } from "@/src/services/upload.service";
import { createBanner } from "@/src/services/banner.service";

export default function CreateBannerPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [linkType, setLinkType] = useState("none");
  const [linkId, setLinkId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // =========================
  // LOAD FLASH SALES
  // =========================
  const fetchFlashSales = async () => {
    try {
      const res = await api.get("/flash-sale/admin/all");
      setFlashSales(res.data);
    } catch (err) {
      console.error("Flash sales load error:", err);
    }
  };

  useEffect(() => {
    fetchFlashSales();
  }, []);

  // =========================
  // IMAGE UPLOAD (AWS S3)
  // =========================
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadImage(file);

      console.log("AWS S3 Response:", res);

      // AWS S3 response থেকে URL বের করা
      const imageUrl =
        res?.Location ||
        res?.location ||
        res?.data?.Location ||
        res?.data?.location ||
        res?.url ||
        res?.imageUrl ||
        res?.data?.url ||
        res?.data?.imageUrl ||
        (typeof res === "string" ? res : "");

      if (imageUrl) {
        setImage(imageUrl);
      } else {
        alert("ইমেজ URL পাওয়া যায়নি! Console চেক করুন।");
      }
    } catch (err: any) {
      console.error("Upload Error:", err?.response?.data || err?.message || err);
      alert(err?.response?.data?.message || err?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // CREATE BANNER
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image first");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title,
        image,
        linkType,
        linkId: linkId || null,
        isActive,
      };

      await createBanner(payload);

      alert("Banner Created Successfully");
      router.push("/dashboard/banners");
    } catch (err: any) {
      console.error("Create Banner Error:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Banner</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium mb-1">Banner Title</label>
          <input
            type="text"
            placeholder="Enter banner title"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* LINK TYPE */}
        <div>
          <label className="block text-sm font-medium mb-1">Link Type</label>
          <select
            value={linkType}
            onChange={(e) => {
              setLinkType(e.target.value);
              setLinkId("");
            }}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="none">No Action</option>
            <option value="flashSale">Flash Sale</option>
          </select>
        </div>

        {/* FLASH SALE SELECT */}
        {linkType === "flashSale" && (
          <div>
            <label className="block text-sm font-medium mb-1">Select Flash Sale</label>
            <select
              value={linkId}
              onChange={(e) => setLinkId(e.target.value)}
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Select Flash Sale</option>
              {flashSales.map((sale: any) => (
                <option key={sale._id} value={sale._id}>
                  {sale.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* IMAGE UPLOAD & PREVIEW */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Banner Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="border p-2 w-full rounded"
          />

          {uploading && (
            <p className="text-sm text-blue-600 mt-2 font-medium">Uploading image to S3...</p>
          )}

          {image && !uploading && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <img
                src={image}
                alt="Banner Preview"
                className="w-full h-[220px] object-cover rounded border"
                onError={() => alert("Image failed to load. Check AWS S3 permissions / CORS.")}
              />
            </div>
          )}
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={String(isActive)}
            onChange={(e) => setIsActive(e.target.value === "true")}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-black text-white px-6 py-3 rounded w-full font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition"
        >
          {loading ? "Creating..." : "Create Banner"}
        </button>
      </form>
    </div>
  );
}
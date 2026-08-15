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

  const [linkType, setLinkType] =
    useState("none");

  const [linkId, setLinkId] =
    useState("");

  const [isActive, setIsActive] =
    useState(true);

  const [flashSales, setFlashSales] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOAD FLASH SALES
  // =========================
  const fetchFlashSales = async () => {
    try {
      const res = await api.get(
        "/flash-sale",
      );

      setFlashSales(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // LOAD SINGLE BANNER
  // =========================
  const fetchBanner = async () => {
    try {
      const res = await api.get(
        `/banners/${id}`,
      );

      const banner = res.data;

      setTitle(banner.title || "");
      setImage(banner.image || "");

      setLinkType(
        banner.linkType || "none",
      );

      setLinkId(
        banner.linkId || "",
      );

      setIsActive(
        banner.isActive ?? true,
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBanner();
      fetchFlashSales();
    }
  }, [id]);

  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleUpload = async (
    e: any,
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    try {
      const res =
        await uploadImage(file);

      const imageUrl =
        res.url ||
        res.imageUrl ||
        res.secure_url ||
        res.data?.url ||
        res.data?.imageUrl;

      setImage(imageUrl);
    } catch (err) {
      console.log(
        "UPLOAD ERROR",
        err,
      );
    }
  };

  // =========================
  // UPDATE BANNER
  // =========================
  const handleUpdate = async (
    e: any,
  ) => {
    e.preventDefault();

    if (!image) {
      alert(
        "Please upload image first",
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title,
        image,
        linkType,
        linkId:
          linkId || null,
        isActive,
      };

      console.log(
        "UPDATE PAYLOAD",
        payload,
      );

      await updateBanner(
        id as string,
        payload,
      );

      alert(
        "Banner Updated Successfully",
      );

      router.push(
        "/dashboard/banners",
      );
    } catch (err: any) {
      console.log(
        err?.response?.data || err,
      );

      alert(
        err?.response?.data
          ?.message ||
          "Update Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Edit Banner
      </h1>

      <form
        onSubmit={handleUpdate}
        className="space-y-4"
      >

        {/* TITLE */}
        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value,
            )
          }
          placeholder="Banner Title"
          className="border p-3 w-full rounded"
        />

        {/* LINK TYPE */}
        <select
          value={linkType}
          onChange={(e) => {
            setLinkType(
              e.target.value,
            );

            setLinkId("");
          }}
          className="border p-3 w-full rounded"
        >
          <option value="none">
            No Action
          </option>

          <option value="flashSale">
            Flash Sale
          </option>
        </select>

        {/* FLASH SALE SELECT */}
        {linkType ===
          "flashSale" && (
          <select
            value={linkId}
            onChange={(e) =>
              setLinkId(
                e.target.value,
              )
            }
            className="border p-3 w-full rounded"
          >
            <option value="">
              Select Flash Sale
            </option>

            {flashSales.map(
              (sale: any) => (
                <option
                  key={
                    sale._id
                  }
                  value={
                    sale._id
                  }
                >
                  {sale.title}
                </option>
              ),
            )}
          </select>
        )}

        {/* IMAGE */}
        <input
          type="file"
          onChange={
            handleUpload
          }
        />

        {image && (
          <img
            src={image}
            alt="Banner"
            className="w-full h-[220px] object-cover rounded"
          />
        )}

        {/* STATUS */}
        <select
          value={String(
            isActive,
          )}
          onChange={(e) =>
            setIsActive(
              e.target.value ===
                "true",
            )
          }
          className="border p-3 w-full rounded"
        >
          <option value="true">
            Active
          </option>

          <option value="false">
            Inactive
          </option>
        </select>

        {/* UPDATE BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded w-full"
        >
          {loading
            ? "Updating..."
            : "Update Banner"}
        </button>

      </form>

    </div>
  );
}

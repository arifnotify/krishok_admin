"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getProductById,
  updateProduct,
} from "@/src/services/product.service";

import {
  getMainCategories,
  getSubCategories,
} from "@/src/services/category.service";

import { uploadImages } from "@/src/services/upload.service";

import { Category } from "@/src/types/category";

export default function EditProductPage() {
  const { id } = useParams();

  // SAME AS CREATE PAGE STATES
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");

  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("");
  const [productType, setProductType] = useState("regular");

  const [expiryDate, setExpiryDate] =useState("");
  const [location, setLocation] = useState("");

  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // FETCH PRODUCT + MAIN CATEGORIES
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [product, mains] = await Promise.all([
        getProductById(id as string),
        getMainCategories(),
      ]);

      setCategories(mains);

      // PREFILL DATA
      setTitleEn(product.title?.en || "");
      setTitleBn(product.title?.bn || "");

      setDescriptionEn(product.description?.en || "");

      setDescriptionBn(product.description?.bn || "");
      setPrice(product.price);
      setDiscountPrice(product.discountPrice || "");
      setStock(product.stock);
      setBrand(product.brand);
      setUnit(product.unit || "pcs");
      setProductType(product.productType || "regular");
      setExpiryDate( product.expiryDate || "");
      setExpiryDate(product.expiryDate? product.expiryDate.split("T")[0] : "",);
      setLocation(product.location);
      setImages(product.images || []);

      setCategory(product.category?._id);

      // LOAD SUBCATEGORIES IF EXISTS
      if (product.category?.parentId) {
        setMainCategory(product.category.parentId);

        const subs = await getSubCategories(
          product.category.parentId
        );

        setSubCategories(subs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  // MAIN CATEGORY CHANGE
  const handleMainCategory = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;

    setMainCategory(value);
    setCategory("");
    setSubCategories([]);

    if (value) {
      const data = await getSubCategories(value);
      setSubCategories(data);
    }
  };

  // MULTIPLE IMAGE UPLOAD (APPEND MODE)
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setLoading(true);

      const res = await uploadImages(files);

      const imageUrls = res.map((item: any) => item.url);

      setImages((prev) => [...prev, ...imageUrls]);
    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE IMAGE
  const removeImage = (img: string) => {
    setImages(images.filter((i) => i !== img));
  };

  // UPDATE PRODUCT
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateProduct(
        id as string,
        {
          title: {
            en: titleEn,
            bn: titleBn,
          },

          description: {
            en: descriptionEn,
            bn: descriptionBn,
          },

          price: Number(price),

          discountPrice:
            Number(discountPrice) ||
            undefined,

          stock: Number(stock),

          brand,

          unit,

          productType,

          expiryDate:
            productType === "regular"
              ? expiryDate
              : undefined,

          location,

          category,

          images,
        },
      );

      alert("Product Updated Successfully");
      window.location.href = "/products";
    } catch (err) {
      console.error(err);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="p-10">Loading product...</div>;
  }

  return (
    <div className="max-w-[1000px] mx-auto p-6">
      <div className="bg-white rounded-3xl shadow p-8">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            ✏️
          </div>
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-gray-500 mt-1">
              Update product details and save changes.
            </p>
          </div>
        </div>

        <div className="space-y-7">

          {/* TITLE */}
        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Product Title (English)"
            value={titleEn}
            onChange={(e) =>
              setTitleEn(e.target.value)
            }
            className="w-full border border-gray-200 rounded-2xl px-5 py-3.5"
          />

          <input
            type="text"
            placeholder="পণ্যের নাম (বাংলা)"
            value={titleBn}
            onChange={(e) =>
              setTitleBn(e.target.value)
            }
            className="w-full border border-gray-200 rounded-2xl px-5 py-3.5"
          />

        </div>

          {/* DESCRIPTION */}
          <div className="grid grid-cols-2 gap-4">

            <textarea
              placeholder="Description (English)"
              value={descriptionEn}
              onChange={(e) =>
                setDescriptionEn(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-2xl px-5 py-3 h-32"
            />

            <textarea
              placeholder="বিবরণ (বাংলা)"
              value={descriptionBn}
              onChange={(e) =>
                setDescriptionBn(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-2xl px-5 py-3 h-32"
            />

          </div>

          {/* CATEGORY */}
          <div className="grid grid-cols-2 gap-6">

            {/* MAIN CATEGORY */}
            <select
              value={mainCategory}
              onChange={handleMainCategory}
              className="w-full border rounded-2xl px-5 py-3.5"
            >
              <option value="">Main Category</option>

              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>

            {/* SUB CATEGORY */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-2xl px-5 py-3.5"
            >
              <option value="">Sub Category</option>

              {subCategories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>

          </div>

          {/* PRICE */}
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-2xl px-5 py-3.5"
          />

          {/* DISCOUNT */}
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full border rounded-2xl px-5 py-3.5"
          />

          {/* STOCK */}
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border rounded-2xl px-5 py-3.5"
          />

          {/* BRAND */}
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border rounded-2xl px-5 py-3.5"
          />
          {/* unit */}
                      <input
              type="text"
              placeholder="kg / gm / pcs / each"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full border rounded-2xl px-5 py-3.5"
            />

            {/* product type */}
                    <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Type
                    </label>

                    <select
                      value={productType}
                    onChange={(e) => {
                    setProductType(e.target.value);

                    if (e.target.value === "fresh") {
                      setExpiryDate("");
                    }
                  }}
                      className="w-full border rounded-2xl px-5 py-3.5"
                    >
                      <option value="regular">
                        Regular Product
                      </option>

                      <option value="fresh">
                        Fresh Product
                      </option>
                    </select>
                  </div>
                  {productType === "regular" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Expiry Date
                      </label>

                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) =>
                          setExpiryDate(e.target.value)
                        }
                        className="w-full border rounded-2xl px-5 py-3.5"
                      />
                    </div>
                  )}
          {/* LOCATION */}
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-2xl px-5 py-3.5"
          />

          {/* UPLOAD IMAGES */}
          <input
            type="file"
            multiple
            onChange={handleUpload}
          />

          {/* IMAGE PREVIEW */}
          <div className="flex gap-4 flex-wrap mt-4">

            {images.map((img, i) => (
              <div key={i} className="relative">

                <img
                  src={img}
                  className="w-24 h-24 object-cover rounded-xl border"
                />

                <button
                  onClick={() => removeImage(img)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-2"
                >
                  ✕
                </button>

              </div>
            ))}

          </div>

        </div>

        {/* UPDATE BUTTON */}
        <div className="flex justify-end mt-10">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>

      </div>
    </div>
  );
}
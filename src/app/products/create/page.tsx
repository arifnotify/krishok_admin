"use client";

import { useEffect, useState } from "react";
import {
  getMainCategories,
  getSubCategories,
} from "@/src/services/category.service";
import { Category } from "@/src/types/category";
import { uploadImages } from "@/src/services/upload.service";
import { createProduct } from "@/src/services/product.service";

export default function CreateProductPage() {
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");

  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");

  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [productType, setProductType] = useState("regular");
  const [expiryDate, setExpiryDate] = useState("");
  const [location, setLocation] = useState("");

  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const data = await getMainCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMainCategories();
  }, []);

  const fetchSubCategories = async (parentId: string) => {
    try {
      const data = await getSubCategories(parentId);
      setSubCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMainCategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMainCategory(value);
    setCategory("");
    setSubCategories([]);
    if (value) await fetchSubCategories(value);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setLoading(true);
      const res = await uploadImages(files);
      const imageUrls = res.map((item: any) => item.url);
      setImages(imageUrls);
    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createProduct({
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
          Number(discountPrice) || undefined,

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
        
        youtubeVideoUrl,
      });
      alert("Product Created Successfully");
      window.location.href = "/products";
    } catch (err) {
      console.error(err);
      alert("Create Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-6">
      <div className="bg-white rounded-3xl shadow p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            📦
          </div>
          <div>
            <h1 className="text-3xl font-bold">Create Product</h1>
            <p className="text-gray-500 mt-1">
              Fill in the details below to add a new product to your inventory.
            </p>
          </div>
        </div>

        <div className="space-y-7">
          {/* Product Title */}
          <div className="flex gap-6 items-start">
            <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
              🏷️
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Title (English)"
              className="w-full border border-gray-200 rounded-2xl px-5 py-3.5"
              value={titleEn}
              onChange={(e) =>
                setTitleEn(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="পণ্যের নাম (বাংলা)"
              className="w-full border border-gray-200 rounded-2xl px-5 py-3.5"
              value={titleBn}
              onChange={(e) =>
                setTitleBn(e.target.value)
              }
            />
          </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex gap-6 items-start">
            <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
              📝
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
              <textarea
                placeholder="Description (English)"
                className="w-full border border-gray-200 rounded-2xl px-5 py-3 h-32"
                value={descriptionEn}
                onChange={(e) =>
                  setDescriptionEn(e.target.value)
                }
              />

              <textarea
                placeholder="বিবরণ (বাংলা)"
                className="w-full border border-gray-200 rounded-2xl px-5 py-3 h-32"
                value={descriptionBn}
                onChange={(e) =>
                  setDescriptionBn(e.target.value)
                }
              />
            </div>
            </div>
          </div>

          {/* Main Category & Sub Category */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex gap-6 items-start">
              <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                📋
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Main Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={mainCategory}
                  onChange={handleMainCategory}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                📚
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  SubCategory <span className="text-red-500">*</span>
                </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select SubCategory</option>

                    {subCategories.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
              </div>
            </div>
          </div>
          {/* YouTube Video URL */}
<div className="flex gap-6 items-start">
  <div className="w-11 h-11 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
    ▶️
  </div>

  <div className="flex-1">
    <label className="block text-sm font-medium mb-2">
      YouTube Video URL (Optional)
    </label>

    <input
      type="text"
      placeholder="https://www.youtube.com/watch?v=xxxx"
      className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none"
      value={youtubeVideoUrl}
      onChange={(e) => setYoutubeVideoUrl(e.target.value)}
    />

    <p className="text-xs text-gray-400 mt-2">
      Paste product demo / review video link
    </p>
  </div>
</div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex gap-6 items-start">
              <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                💰
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter price"
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <span className="absolute right-5 top-4 text-gray-500">USD</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                🏷️
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Discount Price</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter discount price"
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  />
                  <span className="absolute right-5 top-4 text-gray-500">USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stock & Brand */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex gap-6 items-start">
              <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                📦
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Stock</label>
                <input
                  type="number"
                  placeholder="Enter stock quantity"
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                🏷️
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Brand</label>
                <input
                  type="text"
                  placeholder="Enter brand"
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Unit */}
              <div className="flex gap-6 items-start">
                <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                  ⚖️
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="kg / gm / pcs / each / liter"
                    className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Example: kg, gm, pcs, each, liter, ml
                  </p>
                </div>
              </div>

                    {/* Product Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Product Type
                      </label>

                      <select
                        value={productType}
                        onChange={(e) =>
                          setProductType(e.target.value)
                        }
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

                    {/* Expiry Date */}
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

          {/* Location */}
          <div className="flex gap-6 items-start">
            <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
              📍
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-blue-500 outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Upload Images */}
          <div className="flex gap-6 items-start">
            <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
              🖼️
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-3">Upload Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  ☁️
                </div>
                <p className="text-gray-600">Drag & drop images here</p>
                <p className="text-gray-400 my-2">or</p>
                <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-2xl inline-block">
                  Choose Files
                  <input type="file" multiple className="hidden" onChange={handleUpload} />
                </label>
                <p className="text-xs text-gray-400 mt-4">JPG, PNG up to 5MB each</p>
              </div>

              {images.length > 0 && (
                <div className="flex gap-4 mt-6 flex-wrap">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="w-24 h-24 object-cover rounded-2xl border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-end gap-4 mt-12">
          <button className="px-8 py-3 border border-gray-300 rounded-2xl flex items-center gap-2 text-gray-700">
            ✕ Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl flex items-center gap-2 hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
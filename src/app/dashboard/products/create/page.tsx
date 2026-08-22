"use client";

import { useEffect, useState } from "react";

import {
  getMainCategories,
  getSubCategories,
} from "@/src/services/category.service";

import {
  getCountries,
} from "@/src/services/country.service";

import { Country } from "@/src/types/country";

import {
  getLocations,
} from "@/src/services/location.service";

import {
  uploadImages,
} from "@/src/services/upload.service";

import {
  createProduct,
} from "@/src/services/product.service";

import { Category } from "@/src/types/category";
import { Location } from "@/src/types/location";

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

  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState("");

  const [unit, setUnit] = useState("pcs");
  const [productType, setProductType] = useState("regular");
  const [isFeatured, setIsFeatured] = useState(false);
  const [homePriority, setHomePriority] = useState("0");
  const [expiryDate, setExpiryDate] = useState("");

  const [locations, setLocations] = useState<string[]>([]);

  // মাল্টিপল সাব-ক্যাটাগরি লিস্ট ম্যানেজ করার জন্য এ্যারে স্টেট
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryLists, setCategoryLists] = useState<Category[][]>([]);

  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locationList, setLocationList] = useState<Location[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryData = await getMainCategories();
        setCategories(categoryData);

        const locationsData = await getLocations();
        setLocationList(
          Array.isArray(locationsData)
            ? locationsData
            : locationsData.data || []
        );

        const countriesData = await getCountries();
        setCountries(countriesData);
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);

  // মাল্টিপল লেভেলের সাব-ক্যাটাগরি পরিবর্তনের হ্যান্ডলার
  const handleCategoryChange = async (value: string, level: number) => {
    // বর্তমান লেভেলের পরের সব সিলেকশন ও লিস্ট কেটে ফেলা
    const updatedSelected = selectedCategories.slice(0, level);
    const updatedLists = categoryLists.slice(0, level);

    if (value) {
      updatedSelected[level] = value;
      
      try {
        const subData = await getSubCategories(value);
        if (subData && subData.length > 0) {
          updatedLists[level + 1] = subData;
        }
      } catch (err) {
        console.log(err);
      }
    }

    setSelectedCategories(updatedSelected);
    setCategoryLists(updatedLists);
  };

  const handleLocationChange = (id: string) => {
    if (locations.includes(id)) {
      setLocations(locations.filter((item) => item !== id));
    } else {
      setLocations([...locations, id]);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setLoading(true);
      const res = await uploadImages(files);
      const urls = res.map((item: any) => item.url);
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      console.log(err);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (img: string) => {
    setImages(images.filter((item) => item !== img));
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      // সর্বশেষ সিলেক্ট করা ক্যাটাগরি আইডিটি বের করা (যদি সাব-ক্যাটাগরি না থাকে তবে মেইন ক্যাটাগরি)
      const finalCategory =
        selectedCategories.length > 0
          ? selectedCategories[selectedCategories.length - 1]
          : "";

      if (!finalCategory) {
        alert("Please select a category");
        setLoading(false);
        return;
      }

      await createProduct({
        title: {
          en: titleEn,
          bn: titleBn,
        },
        description: {
          en: descriptionEn,
          bn: descriptionBn,
        },
        isFeatured,
        homePriority: Number(homePriority),
        youtubeVideoUrl,
        price: Number(price),
        discountPrice: Number(discountPrice) || undefined,
        stock: Number(stock),
        brand,
        unit,
        productType,
        expiryDate: productType === "regular" ? expiryDate : undefined,
        category: finalCategory,
        country: country || undefined,
        locations,
        images,
        isActive: true,
      });

      alert("Product Created Successfully");
      window.location.href = "/dashboard/products";
    } catch (err) {
      console.log(err);
      alert("Create Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-6">
      <div className="bg-white rounded-3xl shadow p-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            📦
          </div>
          <div>
            <h1 className="text-3xl font-bold">Create Product</h1>
            <p className="text-gray-500">Add new product to inventory</p>
          </div>
        </div>

        <div className="space-y-7">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Title English"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="border rounded-2xl px-5 py-3.5"
            />
            <input
              type="text"
              placeholder="পণ্যের নাম বাংলা"
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              className="border rounded-2xl px-5 py-3.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <textarea
              placeholder="Description English"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              className="border rounded-2xl px-5 py-3 h-32"
            />
            <textarea
              placeholder="বিবরণ বাংলা"
              value={descriptionBn}
              onChange={(e) => setDescriptionBn(e.target.value)}
              className="border rounded-2xl px-5 py-3 h-32"
            />
          </div>

          {/* MULTI-LEVEL CATEGORIES */}
          <div className="space-y-4">
            <label className="block text-sm font-medium">Categories</label>
            
            {/* Main Category */}
            <div>
              <select
                value={selectedCategories[0] || ""}
                onChange={(e) => handleCategoryChange(e.target.value, 0)}
                className="w-full border rounded-2xl px-5 py-3.5"
              >
                <option value="">Select Main Category</option>
                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {typeof item.name === "object" ? item.name?.en : item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Category Levels Dynamically Rendered */}
            {categoryLists.map((subList, index) => {
              const level = index + 1;
              if (!subList || subList.length === 0) return null;

              return (
                <div key={level}>
                  <select
                    value={selectedCategories[level] || ""}
                    onChange={(e) => handleCategoryChange(e.target.value, level)}
                    className="w-full border rounded-2xl px-5 py-3.5"
                  >
                    <option value="">Select Sub Category (Level {level})</option>
                    {subList.map((item) => (
                      <option key={item._id} value={item._id}>
                        {typeof item.name === "object" ? item.name?.en : item.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Youtube */}
          <div>
            <label className="block text-sm font-medium mb-2">Youtube Video URL</label>
            <input
              type="text"
              placeholder="https://youtube.com/..."
              value={youtubeVideoUrl}
              onChange={(e) => setYoutubeVideoUrl(e.target.value)}
              className="w-full border rounded-2xl px-5 py-3.5"
            />
          </div>

          {/* PRICE */}
          <div className="grid grid-cols-2 gap-6">
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border rounded-2xl px-5 py-3.5"
            />
            <input
              type="number"
              placeholder="Discount Price"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="border rounded-2xl px-5 py-3.5"
            />
          </div>

          {/* STOCK BRAND */}
          <div className="grid grid-cols-2 gap-6">
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border rounded-2xl px-5 py-3.5"
            />
            <input
              type="text"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="border rounded-2xl px-5 py-3.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border rounded-2xl px-5 py-3.5"
            >
              <option value="">Select Country</option>
              {countries.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          </div>

          {/* UNIT */}
          <input
            type="text"
            placeholder="kg / gm / pcs / liter"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border rounded-2xl px-5 py-3.5"
          />

          {/* PRODUCT TYPE */}
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full border rounded-2xl px-5 py-3.5"
          >
            <option value="regular">Regular Product</option>
            <option value="fresh">Fresh Product</option>
          </select>
          
          <div className="grid grid-cols-2 gap-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <span>Featured Product</span>
            </label>

            <input
              type="number"
              placeholder="Home Priority"
              value={homePriority}
              onChange={(e) => setHomePriority(e.target.value)}
              className="border rounded-2xl px-5 py-3.5"
            />
          </div>

          {/* EXPIRY */}
          {productType === "regular" && (
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border rounded-2xl px-5 py-3.5"
            />
          )}

          {/* LOCATIONS */}
          <div>
            <label className="block text-sm font-medium mb-3">Available Locations</label>
            <div className="grid grid-cols-3 gap-3">
              {locationList.map((location) => (
                <label
                  key={location._id}
                  className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={locations.includes(location._id)}
                    onChange={() => handleLocationChange(location._id)}
                  />
                  <div>
                    <p className="font-medium">
                      {location.district.en} / {location.district.bn}
                    </p>
                    <p className="text-xs text-gray-500">
                      {location.division.en} / {location.division.bn}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-medium mb-3">Upload Images</label>
            <input type="file" multiple onChange={handleUpload} />
            <div className="flex gap-4 flex-wrap mt-5">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    className="w-24 h-24 object-cover rounded-2xl border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              className="px-8 py-3 border rounded-2xl"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
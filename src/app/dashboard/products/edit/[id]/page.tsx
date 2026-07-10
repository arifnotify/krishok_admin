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

import {
  getLocations,
} from "@/src/services/location.service";

import { uploadImages } from "@/src/services/upload.service";

import { Category } from "@/src/types/category";
import { Location } from "@/src/types/location";

export default function EditProductPage() {

  const { id } = useParams();

  const [titleEn,setTitleEn] =
    useState("");

  const [titleBn,setTitleBn] =
    useState("");

  const [
    descriptionEn,
    setDescriptionEn,
  ] = useState("");

  const [
    descriptionBn,
    setDescriptionBn,
  ] = useState("");

  const [price,setPrice] =
    useState("");

  const [
    discountPrice,
    setDiscountPrice,
  ] = useState("");

  const [stock,setStock] =
    useState("");

  const [brand,setBrand] =
    useState("");

  const [unit,setUnit] =
    useState("");

  const [
    productType,
    setProductType,
  ] = useState("regular");

  const [
    expiryDate,
    setExpiryDate,
  ] = useState("");

  // MULTI LOCATION
  const [
    locations,
    setLocations,
  ] = useState<string[]>([]);

  const [
    locationList,
    setLocationList,
  ] = useState<Location[]>([]);

  const [
    mainCategory,
    setMainCategory,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("");

  const [images,setImages] =
    useState<string[]>([]);

  const [
    categories,
    setCategories,
  ] = useState<Category[]>([]);

  const [
    subCategories,
    setSubCategories,
  ] = useState<Category[]>([]);

  const [loading,setLoading] =
    useState(false);

  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const [
        product,
        mains,
        allLocations,
      ] = await Promise.all([
        getProductById(
          id as string,
        ),
        getMainCategories(),
        getLocations(),
      ]);

      setCategories(mains);

      setLocationList(
        Array.isArray(allLocations)
          ? allLocations
          : allLocations.data || []
      );

      setTitleEn(
        product.title?.en || ""
      );

      setTitleBn(
        product.title?.bn || ""
      );

      setDescriptionEn(
        product.description?.en || ""
      );

      setDescriptionBn(
        product.description?.bn || ""
      );

      setPrice(
        String(
          product.price || ""
        )
      );

      setDiscountPrice(
        String(
          product.discountPrice || ""
        )
      );

      setStock(
        String(
          product.stock || ""
        )
      );

      setBrand(
        product.brand || ""
      );

      setUnit(
        product.unit || "pcs"
      );

      setProductType(
        product.productType ||
        "regular"
      );

      setExpiryDate(
        product.expiryDate
          ? product.expiryDate.split(
              "T",
            )[0]
          : ""
      );

      setImages(
        product.images || []
      );

      setCategory(
        product.category?._id ||
        ""
      );

      // MULTI LOCATION LOAD
      setLocations(
        product.locations?.map(
          (item:any) =>
            typeof item ===
            "string"
              ? item
              : item._id
        ) || []
      );

      if (
        product.category?.parentId
      ) {

        setMainCategory(
          product.category
            .parentId
        );

        const subs =
          await getSubCategories(
            product.category
              .parentId
          );

        setSubCategories(
          subs
        );
      }

    } catch (err) {

      console.log(err);

    } finally {

      setPageLoading(false);

    }
  };

  const handleMainCategory =
    async (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {

      const value =
        e.target.value;

      setMainCategory(
        value
      );

      setCategory("");

      setSubCategories([]);

      if (value) {

        const data =
          await getSubCategories(
            value
          );

        setSubCategories(
          data
        );
      }
    };
  // =========================
  // MULTIPLE IMAGE UPLOAD
  // =========================

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files = e.target.files;

    if (!files) return;

    try {

      setLoading(true);

      const res =
        await uploadImages(files);

      const imageUrls =
        res.map(
          (item:any) =>
            item.url
        );

      setImages(
        (prev) => [
          ...prev,
          ...imageUrls,
        ]
      );

    } catch (err) {

      console.log(err);

      alert(
        "Upload Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // REMOVE IMAGE
  // =========================

  const removeImage = (
    img:string
  ) => {

    setImages(
      images.filter(
        (i) => i !== img
      )
    );

  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdate =
    async () => {

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

            price:
              Number(price),

            discountPrice:
              Number(
                discountPrice
              ) || undefined,

            stock:
              Number(stock),

            brand,

            unit,

            productType,

            expiryDate:
              productType ===
              "regular"
                ? expiryDate
                : undefined,

            category,

            // MULTI LOCATION
            locations,

            images,
          }
        );

        alert(
          "Product Updated Successfully"
        );

        window.location.href =
          "/dashboard/products";

      } catch (err) {

        console.log(err);

        alert(
          "Update Failed"
        );

      } finally {

        setLoading(false);

      }
    };

  if (pageLoading) {
    return (
      <div className="p-10">
        Loading Product...
      </div>
    );
  }

  return (

    <div className="max-w-[1000px] mx-auto p-6">

      <div className="bg-white rounded-3xl shadow p-8">

        <div className="space-y-6">

          {/* LOCATION */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Locations
            </label>

            <select
              multiple
              value={locations}
              onChange={(e) => {

                const values =
                  Array.from(
                    e.target.selectedOptions,
                    (option) =>
                      option.value
                  );

                setLocations(
                  values
                );

              }}
              className="
              w-full
              border
              rounded-2xl
              p-3
              min-h-[180px]
              "
            >

              {
                locationList.map(
                  (item:any) => (

                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.district}
                    </option>

                  )
                )
              }

            </select>

            <p className="text-xs text-gray-500 mt-2">
              Ctrl + Click করে
              একাধিক Location Select করুন
            </p>

          </div>

          {/* IMAGE UPLOAD */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Images
            </label>

            <input
              type="file"
              multiple
              onChange={
                handleUpload
              }
            />

          </div>

          {/* IMAGE PREVIEW */}

          <div className="flex gap-4 flex-wrap">

            {
              images.map(
                (img,index) => (

                  <div
                    key={index}
                    className="
                    relative
                    w-24
                    h-24
                    "
                  >

                    <img
                      src={img}
                      alt=""
                      className="
                      w-full
                      h-full
                      object-cover
                      rounded-xl
                      border
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          img
                        )
                      }
                      className="
                      absolute
                      -top-2
                      -right-2
                      bg-red-500
                      text-white
                      rounded-full
                      w-6
                      h-6
                      "
                    >
                      ×
                    </button>

                  </div>

                )
              )
            }

          </div>

          {/* UPDATE BUTTON */}

          <div className="pt-4">

            <button
              onClick={
                handleUpdate
              }
              disabled={
                loading
              }
              className="
              bg-blue-600
              text-white
              px-8
              py-3
              rounded-2xl
              "
            >
              {
                loading
                  ? "Updating..."
                  : "Update Product"
              }
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

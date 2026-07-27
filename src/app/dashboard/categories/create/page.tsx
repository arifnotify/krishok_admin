"use client";

import { useState } from "react";

import {
  createCategory,
} from "@/src/services/category.service";

import {
  uploadImage,
} from "@/src/services/upload.service";


export default function CreateMainCategoryPage() {

  const [name, setName] = useState({
    en: "",
    bn: "",
  });

  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);


  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;


    try {

      const res =
        await uploadImage(file);


      setImage(
        res.url,
      );


    } catch (error) {

      console.log(error);

    }
  };



  // =========================
  // CREATE CATEGORY
  // =========================
  const handleCreate = async () => {

    if (!name.en || !name.bn) {
      alert(
        "Please enter category name in both languages",
      );
      return;
    }


    try {

      setLoading(true);


      await createCategory({

        name: {
          en: name.en,
          bn: name.bn,
        },

        image,

        parentCategory: null,

        isActive: true,

      });


      alert(
        "Main Category Created Successfully",
      );


      window.location.href =
        "/dashboard/categories";


    } catch (error) {

      console.log(error);

      alert(
        "Category Create Failed",
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="p-6">


      <div className="bg-white p-6 rounded-xl shadow">


        <h1 className="text-2xl font-bold mb-6">
          Create Main Category
        </h1>



        {/* ENGLISH NAME */}

        <input

          type="text"

          placeholder="Category Name English"

          className="border p-3 rounded w-full mb-4"

          value={
            name.en
          }

          onChange={(e) =>
            setName({
              ...name,
              en: e.target.value,
            })
          }

        />



        {/* BANGLA NAME */}

        <input

          type="text"

          placeholder="Category Name বাংলা"

          className="border p-3 rounded w-full mb-4"

          value={
            name.bn
          }

          onChange={(e) =>
            setName({
              ...name,
              bn: e.target.value,
            })
          }

        />



        {/* IMAGE */}

        <input

          type="file"

          onChange={
            handleUpload
          }

          className="mb-4"

        />



        {/* IMAGE PREVIEW */}

        {image && (

          <img

            src={image}

            alt="Category"

            className="w-32 h-32 mt-4 rounded-lg object-cover"

          />

        )}




        {/* BUTTON */}

        <button

          onClick={
            handleCreate
          }

          disabled={
            loading
          }

          className="bg-blue-600 text-white px-5 py-3 rounded-lg mt-5"

        >

          {
            loading
              ? "Creating..."
              : "Create Category"
          }


        </button>



      </div>


    </div>

  );

}

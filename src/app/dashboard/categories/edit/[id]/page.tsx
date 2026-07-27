"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getCategory,
  updateCategory,
} from "@/src/services/category.service";

import {
  uploadImage,
} from "@/src/services/upload.service";


export default function EditMainCategoryPage() {

  const params = useParams();

  const id =
    params?.id as string;


  const [name, setName] = useState({
    en: "",
    bn: "",
  });


  const [image, setImage] =
    useState("");


  const [loading, setLoading] =
    useState(false);



  // =========================
  // LOAD CATEGORY
  // =========================

  useEffect(() => {

    if (id) {
      loadCategory();
    }

  }, [id]);



  const loadCategory = async () => {

    try {

      const res =
        await getCategory(id);


      console.log(
        "CATEGORY:",
        res,
      );


      setName({

        en:
          res.name?.en || "",

        bn:
          res.name?.bn || "",

      });


      setImage(
        res.image || "",
      );


    } catch (error) {

      console.log(error);

    }

  };




  // =========================
  // IMAGE UPLOAD
  // =========================

  const handleUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {


      const file =
        e.target.files?.[0];


      if (!file) return;



      try {


        const res =
          await uploadImage(file);



        const url =
          res.url ||
          res.data?.url;



        setImage(
          url,
        );


      } catch (error) {


        console.log(error);


      }


    };




  // =========================
  // UPDATE CATEGORY
  // =========================

  const handleUpdate =
    async () => {


      if (!name.en || !name.bn) {

        alert(
          "Please enter category name in both languages",
        );

        return;

      }



      try {


        setLoading(true);



        await updateCategory(

          id,

          {

            name: {

              en: name.en,

              bn: name.bn,

            },


            image,


            parentCategory:
              null,


            isActive:
              true,

          },

        );



        alert(
          "Category Updated Successfully",
        );



        window.location.href =
          "/dashboard/categories";



      } catch (error) {


        console.log(error);


        alert(
          "Update Failed",
        );


      } finally {


        setLoading(false);


      }

    };




  return (

    <div className="p-6 max-w-2xl mx-auto">


      <div className="bg-white p-6 rounded-xl shadow">


        <h1 className="text-2xl font-bold mb-6">

          Edit Main Category

        </h1>




        {/* ENGLISH NAME */}

        <input

          type="text"

          placeholder="Category Name English"

          value={
            name.en
          }

          onChange={(e) =>

            setName({

              ...name,

              en:
                e.target.value,

            })

          }

          className="w-full border p-3 rounded-lg mb-4"

        />




        {/* BANGLA NAME */}

        <input

          type="text"

          placeholder="Category Name বাংলা"

          value={
            name.bn
          }

          onChange={(e) =>

            setName({

              ...name,

              bn:
                e.target.value,

            })

          }

          className="w-full border p-3 rounded-lg mb-5"

        />





        {/* IMAGE UPLOAD */}

        <input

          type="file"

          onChange={
            handleUpload
          }

          className="mb-4"

        />





        {/* IMAGE PREVIEW */}

        {image && (

          <div className="mt-4">


            <img

              src={image}

              alt="Category"

              className="w-32 h-32 object-cover rounded-lg border"

            />



            <button

              type="button"

              onClick={() =>
                setImage("")
              }

              className="bg-red-500 text-white px-4 py-2 rounded mt-3"

            >

              Remove Image

            </button>



          </div>

        )}






        {/* UPDATE BUTTON */}

        <button

          onClick={
            handleUpdate
          }

          disabled={
            loading
          }

          className="bg-blue-600 text-white px-5 py-3 rounded-lg mt-6 w-full"

        >

          {

            loading

              ? "Updating..."

              : "Update Category"

          }


        </button>



      </div>


    </div>

  );

}

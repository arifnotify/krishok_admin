"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCategory, updateCategory } from "@/src/services/category.service";
import { uploadImage } from "@/src/services/upload.service";

export default function EditMainCategoryPage() {
  const params = useParams();
  const id = params?.id as string;

  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [showOnHome,setShowOnHome]=useState(false);

  useEffect(() => {
    if (id) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      const res = await getCategory(id);
      setNameEn(res.name?.en || res.name || "");
      setNameBn(res.name?.bn || "");
      setImage(res.image || "");
      setSortOrder(res.sortOrder || 0);
      setShowOnHome(
 res.showOnHome ?? false
);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadImage(file);
      const url = res.url || res.data?.url;
      setImage(url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateCategory(id, {
        name: {
          en: nameEn,
          bn: nameBn,
        },
        image,
        parentCategory: null,
        sortOrder,
        showOnHome,
      });

      alert("Category Updated Successfully");
      window.location.href = "/dashboard/categories";
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Main Category</h1>

        <input
          type="text"
          placeholder="Category Name (English)"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="text"
          placeholder="ক্যাটাগরির নাম (বাংলা)"
          value={nameBn}
          onChange={(e) => setNameBn(e.target.value)}
          className="w-full border p-3 rounded-lg mb-5"
        />

        <input type="file" onChange={handleUpload} className="mb-4" />

        {image && (
          <div className="mt-4">
            <img src={image} className="w-32 h-32 object-cover rounded-lg border" />
            <button
              type="button"
              onClick={() => setImage("")}
              className="bg-red-500 text-white px-4 py-2 rounded mt-3 block"
            >
              Remove Image
            </button>
          </div>
        )}

        <div className="mb-4">
        <label className="block font-medium mb-2">
          Sort Order
        </label>

        <input
          type="number"
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(Number(e.target.value))
          }
          className="w-full border p-3 rounded-lg"
        />
      </div>
      <div className="flex items-center gap-3 mb-4">

<input
 type="checkbox"
 checked={showOnHome}
 onChange={(e)=>
 setShowOnHome(e.target.checked)
 }
/>

<label>
Show on Home Page
</label>

</div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg mt-6 w-full"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>
      </div>
    </div>
  );
}

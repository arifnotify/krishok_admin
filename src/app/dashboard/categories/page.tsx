"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  deleteCategory,
  getCategories,
} from "@/src/services/category.service";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      // order ফিল্ড অনুযায়ী ক্যাটাগরিগুলো সর্ট (Sort) করা হচ্ছে
      const sortedData = data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      setCategories(sortedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // এখানে ত্রুটিটি সংশোধন করা হয়েছে
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCategory(id);
      alert("Category Deleted Successfully");
      loadCategories();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // উপরে বা নিচে নেওয়ার ফাংশন (Reorder Function)
  const handleMove = async (index: number, direction: "up" | "down", type: "main" | "sub") => {
    const currentList = type === "main" ? mainCategories : subCategories;
    
    if (direction === "up" && index === 0) return; 
    if (direction === "down" && index === currentList.length - 1) return; 

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // অ্যারে-তে পজিশন অদলবদল (Swap) করা
    const updatedList = [...currentList];
    const temp = updatedList[index];
    updatedList[index] = updatedList[targetIndex];
    updatedList[targetIndex] = temp;

    // অন্যান্য ক্যাটাগরিগুলোর সাথে যুক্ত করা
    const remainingList = type === "main" ? subCategories : mainCategories;
    setCategories([...updatedList, ...remainingList]);
    
    // নোট: ইউজার অ্যাপে পার্মানেন্টলি দেখানোর জন্য এই পজিশনটি ব্যাকএন্ড API-তে সেভ করতে হবে।
    alert("Order updated locally! Make sure to save this order in your backend API.");
  };

  // MAIN CATEGORY
  const mainCategories = categories.filter((item) => !item.parentCategory);

  // SUB CATEGORY
  const subCategories = categories.filter((item) => item.parentCategory);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500 mt-1">Manage Main & Sub Categories</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/categories/main/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >
            + Main Category
          </Link>

          <Link
            href="/dashboard/categories/sub/create"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
          >
            + Sub Category
          </Link>
        </div>
      </div>

      {/* MAIN CATEGORY TABLE */}
      <div className="bg-white shadow rounded-xl p-5 mb-8">
        <h2 className="text-xl font-bold mb-5">Main Categories</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 w-20">Order</th>
              <th className="text-left py-3">Image</th>
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-10 text-center">Loading...</td>
              </tr>
            ) : mainCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center">No Main Categories Found</td>
              </tr>
            ) : (
              mainCategories.map((item, index) => (
                <tr key={item._id} className="border-b">
                  {/* Up & Down Buttons */}
                  <td className="py-4">
                    <div className="flex flex-col gap-1 w-fit">
                      <button 
                        disabled={index === 0} 
                        onClick={() => handleMove(index, "up", "main")}
                        className="p-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30 text-xs"
                      >
                        ▲
                      </button>
                      <button 
                        disabled={index === mainCategories.length - 1} 
                        onClick={() => handleMove(index, "down", "main")}
                        className="p-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30 text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="py-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-4 font-medium">{item.name}</td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/categories/main/edit/${item._id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SUB CATEGORY TABLE */}
      <div className="bg-white shadow rounded-xl p-5">
        <h2 className="text-xl font-bold mb-5">Sub Categories</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 w-20">Order</th>
              <th className="text-left py-3">Image</th>
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Parent Category</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">Loading...</td>
              </tr>
            ) : subCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">No Sub Categories Found</td>
              </tr>
            ) : (
              subCategories.map((item, index) => (
                <tr key={item._id} className="border-b">
                  {/* Up & Down Buttons */}
                  <td className="py-4">
                    <div className="flex flex-col gap-1 w-fit">
                      <button 
                        disabled={index === 0} 
                        onClick={() => handleMove(index, "up", "sub")}
                        className="p-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30 text-xs"
                      >
                        ▲
                      </button>
                      <button 
                        disabled={index === subCategories.length - 1} 
                        onClick={() => handleMove(index, "down", "sub")}
                        className="p-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30 text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="py-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-4 font-medium">{item.name}</td>
                  <td className="py-4">
                    {item.parentCategory?.name || "-"}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/categories/sub/edit/${item._id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

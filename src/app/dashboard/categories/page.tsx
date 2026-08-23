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
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const mainCategories = categories.filter(
    (item) => !item.parentCategory
  );
  const subCategories = categories.filter(
    (item) => item.parentCategory
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Categories Management</h1>
          <p className="text-gray-500 mt-1">
            Organize, update, and manage your main and sub categories seamlessly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/categories/main/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-md shadow-blue-200 transition"
          >
            + Main Category
          </Link>
          <Link
            href="/dashboard/categories/sub/create"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-md shadow-emerald-200 transition"
          >
            + Sub Category
          </Link>
        </div>
      </div>

      {/* MAIN CATEGORIES SECTION */}
      <div className="bg-white shadow-xl shadow-gray-100 border border-gray-100 rounded-3xl p-6 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full inline-block"></span>
            Main Categories
          </h2>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
            {mainCategories.length} Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-sm uppercase tracking-wider">
                <th className="pb-4 font-semibold">Image</th>
                <th className="pb-4 font-semibold">Category Name</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">Loading categories...</td>
                </tr>
              ) : mainCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">No Main Categories Found</td>
                </tr>
              ) : (
                mainCategories.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt="category"
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xs">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-4 font-medium text-gray-800">
                      <div className="text-base font-semibold">{item.name?.en || item.name}</div>
                      <div className="text-sm text-gray-400">{item.name?.bn}</div>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {item.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/categories/main/edit/${item._id}`}
                          className="bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
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

      {/* SUB CATEGORIES SECTION */}
      <div className="bg-white shadow-xl shadow-gray-100 border border-gray-100 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-600 rounded-full inline-block"></span>
            Sub Categories
          </h2>
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
            {subCategories.length} Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-sm uppercase tracking-wider">
                <th className="pb-4 font-semibold">Image</th>
                <th className="pb-4 font-semibold">Sub Category Name</th>
                <th className="pb-4 font-semibold">Parent Category</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">Loading sub-categories...</td>
                </tr>
              ) : subCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">No Sub Categories Found</td>
                </tr>
              ) : (
                subCategories.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt="subcategory"
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xs">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-4 font-medium text-gray-800">
                      <div className="text-base font-semibold">{item.name?.en || item.name}</div>
                      <div className="text-sm text-gray-400">{item.name?.bn}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-medium text-gray-700">
                        {item.parentCategory?.name?.en || item.parentCategory?.name || "-"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.parentCategory?.name?.bn}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {item.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/categories/sub/edit/${item._id}`}
                          className="bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
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
    </div>
  );
}

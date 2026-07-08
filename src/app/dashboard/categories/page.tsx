"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  deleteCategory,
  getCategories,
} from "@/src/services/category.service";

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories =
    async () => {
      try {
        const data =
          await getCategories();

        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleDelete =
    async (id: string) => {
      const confirmDelete =
        confirm(
          "Are you sure you want to delete this category?"
        );

      if (!confirmDelete)
        return;

      try {
        await deleteCategory(id);

        alert(
          "Category Deleted Successfully"
        );

        loadCategories();
      } catch (error) {
        console.error(error);
        alert(
          "Delete Failed"
        );
      }
    };

  // MAIN CATEGORY
  const mainCategories =
    categories.filter(
      (item) =>
        !item.parentCategory
    );

  // SUB CATEGORY
  const subCategories =
    categories.filter(
      (item) =>
        item.parentCategory
    );

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Categories
          </h1>

          <p className="text-gray-500 mt-1">
            Manage Main & Sub Categories
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            href="/categories/main/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >
            + Main Category
          </Link>

          <Link
            href="/categories/sub/create"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
          >
            + Sub Category
          </Link>

        </div>

      </div>

      {/* MAIN CATEGORY TABLE */}

      <div className="bg-white shadow rounded-xl p-5 mb-8">

        <h2 className="text-xl font-bold mb-5">
          Main Categories
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">
                Image
              </th>

              <th className="text-left py-3">
                Name
              </th>

              <th className="text-left py-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-10 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : mainCategories.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-10 text-center"
                >
                  No Main Categories Found
                </td>
              </tr>
            ) : (
              mainCategories.map(
                (item) => (
                  <tr
                    key={item._id}
                    className="border-b"
                  >
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

                    <td className="py-4 font-medium">
                      {item.name}
                    </td>

                    <td className="py-4">

                      <div className="flex gap-3">

                        <Link
                          href={`/categories/main/edit/${item._id}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

      {/* SUB CATEGORY TABLE */}

      <div className="bg-white shadow rounded-xl p-5">

        <h2 className="text-xl font-bold mb-5">
          Sub Categories
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">
                Image
              </th>

              <th className="text-left py-3">
                Name
              </th>

              <th className="text-left py-3">
                Parent Category
              </th>

              <th className="text-left py-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : subCategories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center"
                >
                  No Sub Categories Found
                </td>
              </tr>
            ) : (
              subCategories.map(
                (item) => (
                  <tr
                    key={item._id}
                    className="border-b"
                  >
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

                    <td className="py-4 font-medium">
                      {item.name}
                    </td>

                    <td className="py-4">
                      {item
                        .parentCategory
                        ?.name || "-"}
                    </td>

                    <td className="py-4">

                      <div className="flex gap-3">

                        <Link
                          href={`/categories/sub/edit/${item._id}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
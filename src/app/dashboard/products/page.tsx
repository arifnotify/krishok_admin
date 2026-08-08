"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  deleteProduct,
  getProducts,
  toggleProductStatus,
} from "@/src/services/product.service";

import { Product } from "@/src/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      console.log("PRODUCTS:", data);

      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // TOGGLE PRODUCT STATUS
  // =========================

  const handleToggle = async (product: Product) => {
    const status = !product.isActive;

    const ok = confirm(
      status
        ? "Are you sure ON this product?"
        : "Are you sure OFF this product?"
    );

    if (!ok) return;

    try {
      await toggleProductStatus(
        product._id,
        status
      );

      setProducts((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                isActive: status,
              }
            : item
        )
      );
    } catch (err) {
      console.log(err);
      alert("Status update failed");
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (id: string) => {
    const ok = confirm(
      "Are you sure delete this product?"
    );

    if (!ok) return;

    try {
      await deleteProduct(id);

      setProducts((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredProducts = products.filter(
    (product) =>
      product.title.en
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.title.bn
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="p-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all your products
          </p>
        </div>

        <Link
          href="/dashboard/products/create"
          className="
            bg-black
            text-white
            px-5
            py-3
            rounded-xl
          "
        >
          Create Product
        </Link>

      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <input
        className="
          w-full
          border
          p-3
          rounded-xl
          mb-5
        "
        placeholder="Search product..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* =========================
          TABLE
      ========================= */}

      <div className="bg-white shadow rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            {/* TABLE HEADER */}

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Image
                </th>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Country
                </th>

                <th className="p-4 text-left">
                  Price
                </th>

                <th className="p-4 text-left">
                  Stock
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Action
                </th>

              </tr>

            </thead>

            {/* TABLE BODY */}

            <tbody>

              {filteredProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="
                      p-10
                      text-center
                      text-gray-500
                    "
                  >
                    No products found
                  </td>

                </tr>

              ) : (

                filteredProducts.map(
                  (product) => (

                    <tr
                      key={product._id}
                      className="border-t"
                    >

                      {/* =========================
                          IMAGE
                      ========================= */}

                      <td className="p-4">

                        {product.images?.[0] ? (

                          <img
                            src={
                              product.images[0]
                            }
                            className="
                              w-16
                              h-16
                              rounded-lg
                              object-cover
                              border
                            "
                            alt={
                              product.title?.en ||
                              "Product"
                            }
                          />

                        ) : (

                          <div
                            className="
                              w-16
                              h-16
                              rounded-lg
                              bg-gray-100
                              flex
                              items-center
                              justify-center
                              text-gray-400
                            "
                          >
                            No Image
                          </div>

                        )}

                      </td>

                      {/* =========================
                          NAME
                      ========================= */}

                      <td className="p-4">

                        <div className="font-medium">
                          {product.title.en}
                        </div>

                        <div className="text-gray-500">
                          {product.title.bn}
                        </div>

                      </td>

                      {/* =========================
                          CATEGORY
                      ========================= */}

                      <td className="p-4">

                        {typeof product.category?.name ===
                          "object" &&
                        product.category?.name !==
                          null ? (

                          <div>

                            <div>
                              {
                                (
                                  product.category
                                    .name as {
                                    en?: string;
                                    bn?: string;
                                  }
                                ).en
                              }
                            </div>

                            <div className="text-gray-500">

                              {
                                (
                                  product.category
                                    .name as {
                                    en?: string;
                                    bn?: string;
                                  }
                                ).bn
                              }

                            </div>

                          </div>

                        ) : (

                          product.category?.name ||
                          "-"

                        )}

                      </td>

                      {/* =========================
                          COUNTRY
                      ========================= */}

                      <td className="p-4">

                        {product.country ? (

                          <div className="flex items-center gap-3">

                            {/* FLAG */}

                            {product.country.flag ? (

                              <img
                                src={
                                  product.country.flag
                                }
                                alt={
                                  product.country.name
                                }
                                className="
                                  w-8
                                  h-6
                                  object-cover
                                  rounded
                                  border
                                "
                              />

                            ) : (

                              <div
                                className="
                                  w-8
                                  h-6
                                  rounded
                                  bg-gray-100
                                  flex
                                  items-center
                                  justify-center
                                  text-xs
                                  text-gray-400
                                "
                              >
                                ?
                              </div>

                            )}

                            {/* COUNTRY NAME */}

                            <div>

                              <div className="font-medium">
                                {
                                  product.country
                                    .name
                                }
                              </div>

                              <div className="text-xs text-gray-500">
                                {
                                  product.country
                                    .code
                                }
                              </div>

                            </div>

                          </div>

                        ) : (

                          <span className="text-gray-400">
                            No Country
                          </span>

                        )}

                      </td>

                      {/* =========================
                          PRICE
                      ========================= */}

                      <td className="p-4">

                        {product.isFlashSale &&
                        product.flashSalePrice &&
                        product.flashSalePrice >
                          0 ? (

                          <div className="flex flex-col">

                            <span className="font-bold text-red-600">
                              ৳{" "}
                              {
                                product.flashSalePrice
                              }
                            </span>

                            <span className="text-sm text-gray-400 line-through">
                              ৳ {product.price}
                            </span>

                          </div>

                        ) : product.discountPrice &&
                          product.discountPrice >
                            0 &&
                          product.discountPrice <
                            product.price ? (

                          <div className="flex flex-col">

                            <span className="font-bold text-green-600">
                              ৳{" "}
                              {
                                product.discountPrice
                              }
                            </span>

                            <span className="text-sm text-gray-400 line-through">
                              ৳ {product.price}
                            </span>

                          </div>

                        ) : (

                          <span className="font-bold">
                            ৳ {product.price}
                          </span>

                        )}

                      </td>

                      {/* =========================
                          STOCK
                      ========================= */}

                      <td className="p-4">

                        {product.stock}

                      </td>

                      {/* =========================
                          STATUS
                      ========================= */}

                      <td className="p-4">

                        <button
                          onClick={() =>
                            handleToggle(
                              product
                            )
                          }
                          className={`
                            px-4
                            py-2
                            rounded-lg
                            text-white
                            ${
                              product.isActive
                                ? "bg-green-600"
                                : "bg-red-600"
                            }
                          `}
                        >

                          {product.isActive
                            ? "ON"
                            : "OFF"}

                        </button>

                      </td>

                      {/* =========================
                          ACTION
                      ========================= */}

                      <td className="p-4">

                        <div className="flex gap-2">

                          <Link
                            href={`/dashboard/products/edit/${product._id}`}
                            className="
                              bg-blue-500
                              text-white
                              px-4
                              py-2
                              rounded-lg
                            "
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(
                                product._id
                              )
                            }
                            className="
                              bg-red-500
                              text-white
                              px-4
                              py-2
                              rounded-lg
                            "
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

    </div>
  );
}

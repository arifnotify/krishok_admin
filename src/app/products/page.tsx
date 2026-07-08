"use client";

import {
  useEffect,
  useState,
} from "react";

import {deleteProduct,getProducts, } from "@/src/services/product.service";
import { Product } from "@/src/types/product";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      try {
        const data =
          await getProducts();

        setProducts(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

  // DELETE PRODUCT
  const handleDelete =
    async (id: string) => {
      const confirmDelete =
        confirm(
          "Delete this product?",
        );

      if (!confirmDelete) return;

      try {
        await deleteProduct(id);

        setProducts((prev) =>
          prev.filter(
            (product) =>
              product._id !== id,
          ),
        );

        alert(
          "Product deleted",
        );
      } catch (err) {
        console.log(err);

        alert(
          "Delete failed",
        );
      }
    };

  // SEARCH FILTER
const filteredProducts =
  products.filter((product) =>
    product.title?.en
      ?.toLowerCase()
      .includes(
        search.toLowerCase(),
      ) ||
    product.title?.bn
      ?.toLowerCase()
      .includes(
        search.toLowerCase(),
      ),
  );

  // LOADING
  if (loading) {
    return (
      <div>
        Loading products...
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Products
        </h1>

          <Link
    href="/products/create"
    className="bg-black text-white px-5 py-3 rounded-xl"
  >
    Create Product
  </Link>

      </div>

      {/* SEARCH */}
      <div className="mb-5">

        <input
          type="text"
          placeholder="Search product..."
          className="w-full p-3 border rounded-xl"
          onChange={(e) =>
            setSearch(
              e.target.value,
            )
          }
        />

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

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
                Price
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredProducts.map(
              (product) => (
                <tr
                  key={product._id}
                  className="border-t"
                >

                  {/* IMAGE */}
                  <td className="p-4">

                    <img
                      src={
                        product.images?.[0]
                      }
                      alt={product.title?.en}
                      className="w-[60px] h-[60px] object-cover rounded-lg"
                    />

                  </td>

                  {/* NAME */}
                  <td className="p-4 font-medium">

                    <div>
                    <div className="font-medium">
                      {product.title?.en}
                    </div>

                    <div className="text-sm text-gray-500">
                      {product.title?.bn}
                    </div>
                   </div>

                  </td>

                  {/* CATEGORY */}
                  <td className="p-4">

                    {
                      product.category?.name
                    }

                  </td>

                  {/* PRICE */}
                  <td className="p-4">

                    $
                    {product.price}

                  </td>

                  {/* STOCK */}
                  <td className="p-4">

                    {product.stock}

                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">

                    <div className="flex gap-3">

                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        <Link
                             href={`/products/edit/${product._id}`}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                       >
                                        Edit
                        </Link>
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            product._id,
                          )
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>
              ),
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

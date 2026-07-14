```tsx
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

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
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

  const handleToggle = async (product: Product) => {
    const status = !product.isActive;

    const ok = confirm(
      status
        ? "Are you sure ON this product?"
        : "Are you sure OFF this product?"
    );

    if (!ok) return;

    try {
      await toggleProductStatus(product._id, status);

      setProducts((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? { ...item, isActive: status }
            : item
        )
      );
    } catch (err) {
      console.log(err);
      alert("Status update failed");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure delete this product?");

    if (!ok) return;

    try {
      await deleteProduct(id);

      setProducts((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const filteredProducts = products.filter((product) => {
    const enTitle = product.title?.en || "";
    const bnTitle = product.title?.bn || "";

    return (
      enTitle.toLowerCase().includes(search.toLowerCase()) ||
      bnTitle.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <Link
          href="/dashboard/products/create"
          className="bg-black text-white px-5 py-3 rounded-xl"
        >
          Create Product
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-xl mb-5"
        placeholder="Search product..."
      />

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">
                  <img
                    src={
                      product.images?.[0] ||
                      "/placeholder.png"
                    }
                    className="w-16 h-16 rounded-lg object-cover border"
                    alt={product.title?.en}
                  />
                </td>

                <td className="p-4">
                  <div className="font-medium">
                    {product.title?.en}
                  </div>

                  <div className="text-sm text-gray-500">
                    {product.title?.bn}
                  </div>
                </td>

                <td className="p-4">
                  {product.category?.name || "-"}
                </td>

                <td className="p-4">
                  <div className="flex flex-col">
                    {product.isFlashSale &&
                    product.flashSalePrice &&
                    product.flashSalePrice > 0 ? (
                      <>
                        <span className="font-bold text-red-600">
                          ৳ {product.flashSalePrice.toLocaleString()}
                        </span>

                        <span className="text-sm text-gray-400 line-through">
                          ৳ {product.price.toLocaleString()}
                        </span>
                      </>
                    ) : product.discountPrice &&
                      product.discountPrice > 0 &&
                      product.discountPrice < product.price ? (
                      <>
                        <span className="font-bold text-green-600">
                          ৳ {product.discountPrice.toLocaleString()}
                        </span>

                        <span className="text-sm text-gray-400 line-through">
                          ৳ {product.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold">
                        ৳ {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => handleToggle(product)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      product.isActive
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {product.isActive ? "ON" : "OFF"}
                  </button>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/products/edit/${product._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

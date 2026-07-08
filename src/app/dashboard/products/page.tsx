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

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this product?");
    if (!ok) return;

    try {
      await deleteProduct(id);

      setProducts((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert("Product deleted");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };


  const handleToggle = async (
    id: string,
    status: boolean
  ) => {
    try {
      setProducts((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, isActive: status }
            : item
        )
      );

      await toggleProductStatus(id, status);

    } catch (err) {
      console.log(err);
      fetchProducts();
      alert("Status update failed");
    }
  };


  const filteredProducts = products.filter(
    (product) =>
      product.title.en
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.title.bn
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  if (loading) {
    return (
      <div className="p-6">
        Loading products...
      </div>
    );
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
        type="text"
        placeholder="Search product..."
        className="w-full p-3 border rounded-xl mb-5"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />


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
                Status
              </th>

              <th className="p-4 text-left">
                Action
              </th>
            </tr>
          </thead>


          <tbody>

          {filteredProducts.map((product)=>(

            <tr
              key={product._id}
              className="border-t"
            >

              <td className="p-4">
                <img
                  src={product.images?.[0]}
                  alt={product.title.en}
                  className="w-[60px] h-[60px] object-cover rounded-lg"
                />
              </td>


              <td className="p-4">
                <div className="font-medium">
                  {product.title.en}
                </div>

                <div className="text-sm text-gray-500">
                  {product.title.bn}
                </div>
              </td>


              <td className="p-4">
                {product.category?.name}
              </td>


              <td className="p-4">
                ৳ {product.price}
              </td>


              <td className="p-4">
                {product.stock}
              </td>


              <td className="p-4">

                <button
                  onClick={() =>
                    handleToggle(
                      product._id,
                      !product.isActive
                    )
                  }
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

                <div className="flex gap-3">

                  <Link
                    href={`/dashboard/products/edit/${product._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </Link>


                  <button
                    onClick={() =>
                      handleDelete(product._id)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
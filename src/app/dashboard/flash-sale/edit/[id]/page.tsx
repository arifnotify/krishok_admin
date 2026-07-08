"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getFlashSaleById,
  updateFlashSale,
} from "@/src/services/flash-sale.service";

import { getProducts } from "@/src/services/product.service";

export default function EditFlashSalePage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sale, products] = await Promise.all([
        getFlashSaleById(params.id as string),
        getProducts(),
      ]);

      setAllProducts(products);

      setTitle(sale.title);
      setStartTime(new Date(sale.startTime).toISOString().slice(0, 16));
      setEndTime(new Date(sale.endTime).toISOString().slice(0, 16));
      setIsActive(sale.isActive);

      setSelectedProducts(
        sale.products.map((item: any) => ({
          product: item.product._id || item.product,
          productData: item.product,
          salePrice: item.salePrice,
          oldPrice: item.oldPrice,
        })),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // PRODUCT FUNCTIONS
  // -----------------------

  const addProduct = (product: any) => {
    const exists = selectedProducts.find(
      (item) => item.product === product._id,
    );

    if (exists) return;

    setSelectedProducts([
      ...selectedProducts,
      {
        product: product._id,
        productData: product,
        salePrice: product.price,
        oldPrice: product.price,
      },
    ]);
  };

  const removeProduct = (id: string) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.product !== id),
    );
  };

  const updateSalePrice = (id: string, value: number) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.product === id
          ? { ...p, salePrice: value }
          : p,
      ),
    );
  };

  // -----------------------
  // FILTER PRODUCTS
  // -----------------------

  const filteredProducts = allProducts
    .filter((p) => {
      if (!search) return true;
      return p.title.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const aMatch = a.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const bMatch = b.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
    });

  // -----------------------
  // UPDATE FLASH SALE
  // -----------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        startTime,
        endTime,
        isActive,
        products: selectedProducts.map((p) => ({
          product: p.product,
          salePrice: Number(p.salePrice),
        })),
      };

      await updateFlashSale(params.id as string, payload);

      alert("Flash Sale Updated Successfully");

      router.push("/flash-sale");
    } catch (error: any) {
      console.log(error);
      alert(error?.response?.data?.message || "Update Failed");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Edit Flash Sale
      </h1>

      {/* BASIC INFO */}
      <form onSubmit={handleSubmit}>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <input
            className="w-full border p-3 rounded-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Flash Sale Title"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              type="datetime-local"
              className="border p-3 rounded-xl"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <input
              type="datetime-local"
              className="border p-3 rounded-xl"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />

          </div>

          <select
            className="w-full border p-3 rounded-xl"
            value={String(isActive)}
            onChange={(e) =>
              setIsActive(e.target.value === "true")
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

        </div>

        {/* SELECTED PRODUCTS */}
        <div className="bg-white p-6 mt-6 rounded-xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Selected Products ({selectedProducts.length})
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            {selectedProducts.map((item) => (
              <div key={item.product} className="border p-4 rounded-xl">

                <div className="flex gap-3 items-center">

                  <img
                    src={item.productData?.images?.[0]}
                    className="w-14 h-14 rounded-lg object-cover"
                  />

                  <div>
                    <p className="font-semibold">
                      {item.productData?.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      Old: ৳{item.oldPrice}
                    </p>
                  </div>

                </div>

                <input
                  type="number"
                  className="w-full border p-2 mt-3 rounded"
                  value={item.salePrice}
                  onChange={(e) =>
                    updateSalePrice(
                      item.product,
                      Number(e.target.value),
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() => removeProduct(item.product)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>

              </div>
            ))}

          </div>

        </div>

        {/* ADD PRODUCTS */}
        <div className="bg-white p-6 mt-6 rounded-xl shadow">

          <h2 className="text-xl font-bold mb-3">
            Add Products
          </h2>

          {/* SEARCH */}
          <input
            className="w-full border p-3 rounded-xl mb-4"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b">
                  <th className="p-3">Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map((product) => {
                  const exists = selectedProducts.find(
                    (p) => p.product === product._id,
                  );

                  if (exists) return null;

                  return (
                    <tr key={product._id} className="border-b">

                      <td className="p-3">
                        <img
                          src={product.images?.[0]}
                          className="w-12 h-12 rounded object-cover"
                        />
                      </td>

                      <td>{product.title}</td>

                      <td>৳{product.price}</td>

                      <td>
                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Add
                        </button>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Update Flash Sale
        </button>

      </form>

    </div>
  );
}
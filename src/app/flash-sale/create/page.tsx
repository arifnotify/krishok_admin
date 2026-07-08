"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  getProducts,
} from "@/src/services/product.service";

import {
  createFlashSale,
} from "@/src/services/flash-sale.service";

export default function CreateFlashSalePage() {
  const router =
    useRouter();

  const [products,
    setProducts] =
    useState<any[]>([]);

  const [title,
    setTitle] =
    useState("");

  const [startTime,
    setStartTime] =
    useState("");

  const [endTime,
    setEndTime] =
    useState("");

  const [
    selectedProducts,
    setSelectedProducts,
  ] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      try {
        const data =
          await getProducts();

        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

  const toggleProduct =
    (product: any) => {

      const exists =
        selectedProducts.find(
          (item) =>
            item.product ===
            product._id,
        );

      if (exists) {
        setSelectedProducts(
          selectedProducts.filter(
            (item) =>
              item.product !==
              product._id,
          ),
        );
      } else {
        setSelectedProducts([
          ...selectedProducts,
          {
            product:
              product._id,
            salePrice:
              product.price,
          },
        ]);
      }
    };

  const updatePrice =
    (
      productId: string,
      value: number,
    ) => {
      setSelectedProducts(
        selectedProducts.map(
          (item) =>
            item.product ===
            productId
              ? {
                  ...item,
                  salePrice:
                    value,
                }
              : item,
        ),
      );
    };

  const handleSubmit =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault();

      try {
        await createFlashSale({
          title,
          products:
            selectedProducts,
          startTime,
          endTime,
          isActive: true,
        });

        alert(
          "Flash Sale Created",
        );

        router.push(
          "/flash-sale",
        );
      } catch (error: any) {
        console.log(error);

        alert(
          error?.response
            ?.data
            ?.message ||
            "Failed",
        );
      }
    };

  return (
    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Create Flash Sale
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="bg-white rounded-xl p-6 shadow"
      >

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Flash Sale Title"
            className="w-full border p-3 rounded-xl"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value,
              )
            }
          />

          <input
            type="datetime-local"
            className="w-full border p-3 rounded-xl"
            value={
              startTime
            }
            onChange={(e) =>
              setStartTime(
                e.target.value,
              )
            }
          />

          <input
            type="datetime-local"
            className="w-full border p-3 rounded-xl"
            value={endTime}
            onChange={(e) =>
              setEndTime(
                e.target.value,
              )
            }
          />

        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">
          Select Products
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          {products.map(
            (product: any) => {

              const selected =
                selectedProducts.find(
                  (item) =>
                    item.product ===
                    product._id,
                );

              return (
                <div
                  key={
                    product._id
                  }
                  className="border rounded-xl p-4"
                >

                  <img
                    src={
                      product
                        .images?.[0]
                    }
                    alt=""
                    className="w-full h-40 object-cover rounded-lg"
                  />

                  <h3 className="font-semibold mt-3">
                    {
                      product.name
                    }
                  </h3>

                  <p>
                    ৳
                    {
                      product.price
                    }
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      toggleProduct(
                        product,
                      )
                    }
                    className={`mt-3 px-4 py-2 rounded-lg text-white ${
                      selected
                        ? "bg-green-600"
                        : "bg-black"
                    }`}
                  >
                    {selected
                      ? "Selected"
                      : "Select"}
                  </button>

                  {selected && (
                    <input
                      type="number"
                      className="w-full border p-2 rounded mt-3"
                      value={
                        selected.salePrice
                      }
                      onChange={(e) =>
                        updatePrice(
                          product._id,
                          Number(
                            e
                              .target
                              .value,
                          ),
                        )
                      }
                    />
                  )}

                </div>
              );
            },
          )}

        </div>

        <button
          type="submit"
          className="mt-8 bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Create Flash Sale
        </button>

      </form>

    </div>
  );
}
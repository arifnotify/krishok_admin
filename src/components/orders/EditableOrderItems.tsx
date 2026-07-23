"use client";

import { useState } from "react";
import { Plus, Minus, Trash2, Search, X } from "lucide-react";
import { getProducts } from "@/src/services/product.service";

interface Product {
  _id: string;
  title: {
    en: string;
    bn?: string;
  };
  unit?: string;
  price: number;
  discountPrice?: number;
  flashSalePrice?: number;
  isFlashSale?: boolean;
  images: string[];
  isActive: boolean;
}

interface Props {
  items: any[];
  setItems: (items: any[]) => void;
  locked: boolean;
}

export default function EditableOrderItems({
  items,
  setItems,
  locked,
}: Props) {
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const askPermission = (message: string) => {
    return window.confirm(
      `${message}\n\nAre you sure you want to update this order?`
    );
  };

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || data);
    } catch (err) {
      console.log(err);
    }
  };

  const getEnglishName = (product: Product | any) => {
    if (typeof product?.productName === "object") return product.productName.en || "";
    if (typeof product?.title === "object") return product.title.en || "";
    return product?.productName || "";
  };

  const getBanglaName = (product: Product | any) => {
    if (typeof product?.productName === "object") return product.productName.bn || "";
    if (typeof product?.title === "object") return product.title.bn || "";
    return "";
  };

  const getProductPrice = (product: Product) => {
    if (
      product.isFlashSale &&
      product.flashSalePrice &&
      product.flashSalePrice > 0
    ) {
      return product.flashSalePrice;
    }

    if (product.discountPrice && product.discountPrice > 0) {
      return product.discountPrice;
    }

    return product.price;
  };

  const addProduct = (product: Product) => {
    if (!askPermission(`Add "${getEnglishName(product)}" to this order?`)) {
      return;
    }

    const price = getProductPrice(product);
    const productUnit = product.unit || "pcs"; // 👈 সঠিক ইউনিট সংগ্রহ করা হলো

    const exist = items.find((item) => item.product === product._id);

    if (exist) {
      setItems(
        items.map((item) =>
          item.product === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: item.price * (item.quantity + 1),
              }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          product: product._id,
          productName: {
            en: product.title?.en || "",
            bn: product.title?.bn || "",
          },
          unit: productUnit, // 👈 এখানে প্রোডাক্টের নিজস্ব ইউনিট সেট করা হলো
          productImage: product.images?.[0] || "",
          price,
          quantity: 1,
          totalPrice: price,
        },
      ]);
    }

    setShowProducts(false);
  };

  const updateQty = (index: number, type: "inc" | "dec") => {
    if (!askPermission("Change product quantity?")) {
      return;
    }

    const data = [...items];
    let qty = data[index].quantity;

    if (type === "inc") qty++;
    if (type === "dec" && qty > 1) qty--;

    data[index] = {
      ...data[index],
      quantity: qty,
      totalPrice: data[index].price * qty,
    };

    setItems(data);
  };

  const removeItem = (index: number) => {
    const itemName = getEnglishName(items[index]);
    if (!askPermission(`Remove "${itemName}" from this order?`)) {
      return;
    }

    const data = [...items];
    data.splice(index, 1);
    setItems(data);
  };

  const total = items.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  );

  const filtered = products.filter((product) =>
    getEnglishName(product)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold text-lg">Order Items</h2>

        <button
          disabled={locked}
          onClick={() => {
            if (askPermission("Add new product to order?")) {
              setShowProducts(true);
              loadProducts();
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-green-700 transition"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              const enName = getEnglishName(item);
              const bnName = getBanglaName(item);
              const unit = item.unit || item.product?.unit || "pcs";

              return (
                <tr key={index} className="border-b last:border-0 hover:bg-gray-50/50">
                  <td className="p-3 flex gap-3 items-center">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={enName}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                    )}

                    <div className="flex flex-col gap-0.5">
                      <p className="font-semibold text-gray-900 leading-tight">
                        {enName || "Product"}
                      </p>

                      {bnName && (
                        <p className="text-xs text-gray-500 font-medium">
                          {bnName}
                        </p>
                      )}

                      <p className="text-[11px] text-gray-400 font-normal">
                        Size / Unit: <span className="text-gray-600 font-medium">{unit}</span>
                      </p>
                    </div>
                  </td>

                  <td className="p-3 text-center font-medium">৳{item.price}</td>

                  <td className="p-3">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        disabled={locked}
                        onClick={() => updateQty(index, "dec")}
                        className="border p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-6 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        disabled={locked}
                        onClick={() => updateQty(index, "inc")}
                        className="border p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>

                  <td className="p-3 text-center font-bold text-green-600">
                    ৳{item.totalPrice}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      disabled={locked}
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t flex justify-between items-center bg-gray-50/30">
        <span>
          Total Items: <b>{items.length}</b>
        </span>
        <b className="text-green-600 text-lg">৳{total}</b>
      </div>

      {/* SEARCH PRODUCT MODAL */}
      {showProducts && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] max-h-[600px] overflow-y-auto rounded-xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base">Select Product</h3>
              <button
                onClick={() => setShowProducts(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center border rounded-lg px-3 mb-3 bg-gray-50">
              <Search size={18} className="text-gray-400" />
              <input
                className="w-full p-2 bg-transparent outline-none text-sm"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              {filtered.map((product) => {
                const en = product.title?.en || "";
                const bn = product.title?.bn || "";
                const unit = product.unit || "pcs";

                return (
                  <div
                    key={product._id}
                    onClick={() => addProduct(product)}
                    className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={product.images?.[0]}
                        alt={en}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-sm">{en}</p>
                        {bn && <p className="text-xs text-gray-500">{bn}</p>}
                        <p className="text-[11px] text-gray-400">Unit: {unit}</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">
                      ৳{getProductPrice(product)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

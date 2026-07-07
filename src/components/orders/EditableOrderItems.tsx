"use client";

import { Plus, Minus, Trash2 } from "lucide-react";

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

  // =========================
  // UPDATE QTY
  // =========================
  const updateQty = (index: number, type: "inc" | "dec") => {
    const updated = [...items];

    let qty = updated[index].quantity;

    if (type === "inc") qty += 1;
    if (type === "dec" && qty > 1) qty -= 1;

    updated[index].quantity = qty;
    updated[index].totalPrice = updated[index].price * qty;

    setItems(updated);
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const total = items.reduce(
    (sum, i) => sum + (i.totalPrice || 0),
    0
  );

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="p-5 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Order Items
        </h2>

        {locked && (
          <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
            Locked
          </span>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-4">Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>

          <tbody>

            {items.map((item, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50"
              >

                {/* ITEM */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={item.productImage}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  <div>
                    <p className="font-semibold">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Product ID: {item.product}
                    </p>
                  </div>
                </td>

                {/* PRICE */}
                <td className="text-center">
                  ৳{item.price}
                </td>

                {/* QTY */}
                <td className="text-center">
                  <div className="flex items-center justify-center gap-2">

                    <button
                      disabled={locked}
                      onClick={() => updateQty(index, "dec")}
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-8 text-center">
                      {item.quantity}
                    </span>

                    <button
                      disabled={locked}
                      onClick={() => updateQty(index, "inc")}
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>

                  </div>
                </td>

                {/* TOTAL */}
                <td className="text-center font-semibold text-green-600">
                  ৳{item.totalPrice}
                </td>

                {/* ACTION */}
                <td className="text-right p-4">
                  <button
                    disabled={locked}
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* FOOTER */}
      <div className="p-5 border-t flex justify-between items-center">

        <p className="text-sm text-gray-500">
          Total Items: <b>{items.length}</b>
        </p>

        <p className="text-lg font-bold text-green-600">
          ৳{total}
        </p>

      </div>

    </div>
  );
}
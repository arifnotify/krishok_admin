"use client";

import { printReceipt } from "@/src/utils/printReceipt";

export default function OrderDetailsPanel({
  order,
  items,
}: any) {
  if (!order) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center">
        Select Order
      </div>
    );
  }

  const subtotal =
    items?.reduce(
      (sum: number, item: any) =>
        sum + (item.totalPrice || item.price * item.quantity || 0),
      0
    ) || 0;

  const total =
    subtotal -
    (order.discount || 0) +
    (order.deliveryCharge || 0);

  const buildInvoice = () => ({
    invoiceNumber: order.orderNumber,
    orderNumber: order.orderNumber,
    invoiceDate: new Date().toISOString(),

    customer: {
      name: order.shippingAddress?.fullName || "Customer",
      phone: order.customerPhone,
      address: `${order.shippingAddress?.areaOrVillage || ""} ${
        order.shippingAddress?.landmark || ""
      }`,
    },

    items,

    subtotal,
    deliveryCharge: order.deliveryCharge || 0,
    discount: order.discount || 0,
    total,

    paymentMethod: order.paymentMethod,
    paymentStatus: order.isPaid,
    orderStatus: order.orderStatus,
  });

  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      {/* HEADER */}
      <div className="border-b p-5">
        <h2 className="text-xl font-bold">
          Order #{order.orderNumber}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {items?.length || 0} Item(s) • Delivery Order
        </p>
      </div>

      {/* CUSTOMER + DELIVERY */}
      <div className="grid md:grid-cols-2 gap-8 p-5 border-b">

        <div>
          <h3 className="font-semibold mb-4">
            Customer Details
          </h3>

          <div className="space-y-2 text-sm">

            <p>
              <span className="font-medium">
                Name:
              </span>{" "}
              {order.shippingAddress?.fullName}
            </p>

            <p>
              <span className="font-medium">
                Phone:
              </span>{" "}
              {order.customerPhone}
            </p>

            <p>
              <span className="font-medium">
                Address:
              </span>{" "}
              {order.shippingAddress?.areaOrVillage}
            </p>

          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Delivery Details
          </h3>

          <div className="space-y-2 text-sm">

            <p>
              <span className="font-medium">
                Rider:
              </span>{" "}
              {order.assignedRider?.name || "Not Assigned"}
            </p>

            <p>
              <span className="font-medium">
                Phone:
              </span>{" "}
              {order.assignedRider?.phone || "-"}
            </p>

            <p>
              <span className="font-medium">
                Status:
              </span>{" "}
              <span className="font-semibold">
                {order.orderStatus}
              </span>
            </p>

          </div>
        </div>

      </div>

      {/* ORDER DETAILS HEADER */}
      <div className="flex items-center justify-between border-b p-5">

        <h3 className="font-semibold text-lg">
          Order Details
        </h3>

        <button
          onClick={() => printReceipt(buildInvoice())}
          className="
            border
            px-4
            py-2
            rounded-lg
            text-sm
            hover:bg-gray-50
          "
        >
          🖨 Print Receipt
        </button>

      </div>

      {/* PRODUCTS */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b bg-gray-50">

              <th className="text-left p-4">
                Product
              </th>

              <th className="text-center p-4">
                Qty
              </th>

              <th className="text-right p-4">
                Price
              </th>

              <th className="text-right p-4">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {items?.map((item: any, index: number) => (
              <tr
                key={item._id || index}
                className="border-b"
              >
                <td className="p-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={
                        item.image ||
                        item.product?.images?.[0] ||
                        "/placeholder.png"
                      }
                      alt=""
                      className="
                        w-14
                        h-14
                        rounded
                        object-cover
                        border
                      "
                    />

                    <div>

                      <p className="font-medium">
                        {item.title ||
                          item.product?.title?.en ||
                          item.product?.title}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="text-center p-4">
                  {item.quantity}
                </td>

                <td className="text-right p-4">
                  Taka {item.price}
                </td>

                <td className="text-right p-4 font-medium">
                  Taka {item.totalPrice}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* PAYMENT DETAILS */}
      <div className="border-t p-5">

        <h3 className="font-semibold text-lg mb-4">
          Payment Details
        </h3>

        <div className="max-w-sm ml-auto space-y-2">

          <div className="flex justify-between">
            <span>Items</span>
            <span>{items?.length}</span>
          </div>

          <div className="flex justify-between">
            <span>Payment Method</span>
            <span>{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Taka {subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>
              -Taka {order.discount || 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>
              Taka {order.deliveryCharge || 0}
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-lg">

            <span>Total</span>

            <span>
              Taka {total}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

"use client";

import { Order } from "@/src/types/order";
import { Phone, MapPin, Home, Navigation } from "lucide-react";

interface Props {
  order: Order;
}

export default function CustomerInfoCard({ order }: Props) {
  const address = order.shippingAddress;

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <h2 className="text-lg font-bold text-gray-800">
          Customer Information
        </h2>

        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
          Order User
        </span>

      </div>

      {/* GRID INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* PHONE */}
        <div className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
          <Phone className="text-blue-600" size={18} />

          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-semibold">{order.customerPhone}</p>
          </div>
        </div>

        {/* NAME */}
        <div className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
          <Home className="text-green-600" size={18} />

          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="font-semibold">
              {address?.fullName || "N/A"}
            </p>
          </div>
        </div>

        {/* AREA */}
        <div className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
          <MapPin className="text-red-500" size={18} />

          <div>
            <p className="text-xs text-gray-500">Area / Village</p>
            <p className="font-semibold">
              {address?.areaOrVillage || "N/A"}
            </p>
          </div>
        </div>

        {/* LANDMARK */}
        <div className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
          <Navigation className="text-purple-600" size={18} />

          <div>
            <p className="text-xs text-gray-500">Landmark</p>
            <p className="font-semibold">
              {address?.landmark || "N/A"}
            </p>
          </div>
        </div>

      </div>

      {/* ADDRESS FULL BLOCK */}
      <div className="mt-5 p-4 border rounded-xl bg-gradient-to-r from-gray-50 to-white">

        <p className="text-xs text-gray-500 mb-1">
          Full Address
        </p>

        <p className="text-sm font-medium text-gray-700">
          {address
            ? `${address.areaOrVillage || ""}, ${address.landmark || ""}`
            : "No Address Found"}
        </p>

      </div>

    </div>
  );
}
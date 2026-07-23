"use client";

import { Order } from "@/src/types/order";
import { Phone, MapPin, User } from "lucide-react";

interface Props {
  order: Order;
}

export default function CustomerInfoCard({ order }: Props) {
  const address = order?.shippingAddress as any;

  // 🔴 FULL ADDRESS FORMATTER FUNCTION
  const getFullAddress = () => {
    if (!address) return "N/A";

    // যদি সরাসরি স্ট্রিং আকারে অ্যাড্রেস থাকে
    if (typeof address === "string") return address;

    // অবজেক্ট ফিল্ডগুলো থেকে ফাঁকা ফিল্ড বাদ দিয়ে একসাথে ফরম্যাট করার লজিক
    const parts = [
      address.addressDetails || address.street || address.house, // বিস্তারিত ঠিকানা / বাসা / রোড
      address.areaOrVillage || address.area,                      // এরিয়া বা গ্রাম
      address.thana || address.upazila,                          // থানা / উপজেলা
      address.district || address.city,                          // জেলা / শহর
      address.postalCode || address.zipCode,                      // পোস্টাল কোড
    ].filter(Boolean); // ফাঁকা ফিল্ড ফিল্টার করে দেবে

    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  return (
    <div className="bg-white rounded-xl border p-5 h-full">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-5">
        <User size={20} className="text-blue-600" />
        <h2 className="font-bold text-gray-800">Customer Information</h2>
      </div>

      <div className="space-y-4 text-sm">
        {/* NAME */}
        <div>
          <p className="text-gray-500 text-xs mb-1">Name</p>
          <p className="font-semibold text-gray-800">
            {address?.fullName || "N/A"}
          </p>
        </div>

        {/* PHONE */}
        <div>
          <p className="text-gray-500 text-xs mb-1">Phone</p>
          <p className="font-semibold text-gray-800 flex gap-2 items-center">
            <Phone size={15} className="text-gray-400 shrink-0" />
            {order?.customerPhone || address?.phone || "N/A"}
          </p>
        </div>

        {/* FULL ADDRESS */}
        <div>
          <p className="text-gray-500 text-xs mb-1">Delivery Address</p>
          <div className="font-medium text-gray-700 flex gap-2 items-start mt-1">
            <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{getFullAddress()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

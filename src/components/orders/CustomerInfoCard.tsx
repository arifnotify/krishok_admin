"use client";

import { Order } from "@/src/types/order";
import { Phone, MapPin, User } from "lucide-react";

interface Props {
  order: Order;
}

export default function CustomerInfoCard({ order }: Props) {
  const address = order?.shippingAddress as any;

  const getFullAddress = () => {
    if (!address) return "N/A";

    if (typeof address === "string") {
      return address;
    }

    const parts = [
      address.areaOrVillage,
      address.landmark,
      address.directionNote,
      address.label ? `(${address.label})` : null,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : "N/A";
  };

  const mapUrl =
    address?.googleMapUrl ||
    (address?.latitude && address?.longitude
      ? `https://www.google.com/maps?q=${address.latitude},${address.longitude}`
      : null);

  return (
    <div className="bg-white rounded-xl border p-5 h-full">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-5">
        <User size={20} className="text-blue-600" />
        <h2 className="font-bold text-gray-800">
          Customer Information
        </h2>
      </div>

      <div className="space-y-4 text-sm">
        {/* NAME */}
        <div>
          <p className="text-gray-500 text-xs mb-1">
            Name
          </p>

          <p className="font-semibold text-gray-800">
            {address?.fullName || "N/A"}
          </p>
        </div>

        {/* PHONE */}
        <div>
          <p className="text-gray-500 text-xs mb-1">
            Phone
          </p>

          <p className="font-semibold text-gray-800 flex gap-2 items-center">
            <Phone
              size={15}
              className="text-gray-400 shrink-0"
            />

            {address?.phoneNumber ||
              order?.customerPhone ||
              "N/A"}
          </p>
        </div>

        {/* DELIVERY ADDRESS */}
        <div>
          <p className="text-gray-500 text-xs mb-1">
            Delivery Address
          </p>

          <div className="font-medium text-gray-700 flex gap-2 items-start mt-1">
            <MapPin
              size={16}
              className="text-red-500 shrink-0 mt-0.5"
            />

            <span className="leading-relaxed">
              {getFullAddress()}
            </span>
          </div>
        </div>

        {/* GOOGLE MAP LINK */}
        {mapUrl && (
          <div>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              <MapPin size={15} />
              View Customer Location
            </a>
          </div>
        )}

        {/* GPS COORDINATES */}
        {address?.latitude && address?.longitude && (
          <div className="text-xs text-gray-500">
            Lat: {address.latitude} | Lng:{" "}
            {address.longitude}
          </div>
        )}

        {/* MAP PREVIEW */}
        {address?.latitude && address?.longitude && (
          <div className="mt-3 rounded-lg overflow-hidden border">
            <iframe
              width="100%"
              height="250"
              loading="lazy"
              className="w-full"
              src={`https://maps.google.com/maps?q=${address.latitude},${address.longitude}&z=15&output=embed`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

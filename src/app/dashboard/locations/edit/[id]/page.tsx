"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getLocationById,
  updateLocation,
} from "@/src/services/location.service";

export default function EditLocationPage() {
  const params = useParams();
  const router = useRouter();

  const [division, setDivision] = useState({ en: "", bn: "" });
  const [district, setDistrict] = useState({ en: "", bn: "" });
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    const data = await getLocationById(params.id as string);

    setDivision(data.division);
    setDistrict(data.district);
    setDeliveryCharge(data.deliveryCharge);
    setIsActive(data.isActive);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateLocation(params.id as string, {
      division,
      district,
      deliveryCharge,
      isActive,
    });

    alert("Location Updated");
    router.push("/dashboard/locations");
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-5">Edit Location</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Division */}
        <div>
          <label className="block font-semibold mb-1">Division</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="border p-3 w-full"
              value={division.en}
              onChange={(e) =>
                setDivision({ ...division, en: e.target.value })
              }
              placeholder="English"
            />
            <input
              className="border p-3 w-full"
              value={division.bn}
              onChange={(e) =>
                setDivision({ ...division, bn: e.target.value })
              }
              placeholder="Bangla"
            />
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block font-semibold mb-1">District</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="border p-3 w-full"
              value={district.en}
              onChange={(e) =>
                setDistrict({ ...district, en: e.target.value })
              }
              placeholder="English"
            />
            <input
              className="border p-3 w-full"
              value={district.bn}
              onChange={(e) =>
                setDistrict({ ...district, bn: e.target.value })
              }
              placeholder="Bangla"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Delivery Charge</label>
          <input
            className="border p-3 w-full"
            type="number"
            value={deliveryCharge}
            onChange={(e) => setDeliveryCharge(Number(e.target.value))}
            placeholder="Delivery Charge"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        <button className="bg-black text-white px-5 py-2 rounded">
          Update Location
        </button>
      </form>
    </div>
  );
}
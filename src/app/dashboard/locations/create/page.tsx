"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLocation } from "@/src/services/location.service";

export default function CreateLocation() {
  const router = useRouter();

  const [form, setForm] = useState({
    division: { en: "", bn: "" },
    district: { en: "", bn: "" },
    deliveryCharge: 0,
    isActive: true,
  });

  const handleSubmit = async () => {
    await createLocation(form);
    router.push("/dashboard/locations");
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-2xl font-bold mb-5">Create Location</h1>

      {/* Division English & Bengali */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <input
          placeholder="Division (English)"
          className="border p-3 w-full"
          value={form.division.en}
          onChange={(e) =>
            setForm({
              ...form,
              division: { ...form.division, en: e.target.value },
            })
          }
        />
        <input
          placeholder="Division (Bangla)"
          className="border p-3 w-full"
          value={form.division.bn}
          onChange={(e) =>
            setForm({
              ...form,
              division: { ...form.division, bn: e.target.value },
            })
          }
        />
      </div>

      {/* District English & Bengali */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <input
          placeholder="District (English)"
          className="border p-3 w-full"
          value={form.district.en}
          onChange={(e) =>
            setForm({
              ...form,
              district: { ...form.district, en: e.target.value },
            })
          }
        />
        <input
          placeholder="District (Bangla)"
          className="border p-3 w-full"
          value={form.district.bn}
          onChange={(e) =>
            setForm({
              ...form,
              district: { ...form.district, bn: e.target.value },
            })
          }
        />
      </div>

      <input
        type="number"
        placeholder="Delivery Charge"
        className="w-full border p-3 mb-3"
        value={form.deliveryCharge}
        onChange={(e) =>
          setForm({
            ...form,
            deliveryCharge: Number(e.target.value),
          })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-5 py-2 rounded"
      >
        Save Location
      </button>
    </div>
  );
}
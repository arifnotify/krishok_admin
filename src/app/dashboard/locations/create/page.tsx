"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { createLocation } from "@/src/services/location.service";

export default function CreateLocation() {
  const router = useRouter();

  const [form, setForm] =
    useState({
      division: "",
      district: "",
      deliveryCharge: 0,
      isActive: true,
    });

  const handleSubmit =
    async () => {
      await createLocation(form);

      router.push("/locations");
    };

  return (
    <div className="bg-white p-6 rounded shadow">

      <h1 className="text-2xl font-bold mb-5">
        Create Location
      </h1>

      <input
        placeholder="Division"
        className="w-full border p-3 mb-3"
        onChange={(e) =>
          setForm({
            ...form,
            division:
              e.target.value,
          })
        }
      />

      <input
        placeholder="District"
        className="w-full border p-3 mb-3"
        onChange={(e) =>
          setForm({
            ...form,
            district:
              e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Delivery Charge"
        className="w-full border p-3 mb-3"
        onChange={(e) =>
          setForm({
            ...form,
            deliveryCharge:
              Number(
                e.target.value
              ),
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
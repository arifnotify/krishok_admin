"use client";

import { useEffect, useState } from "react";

import {
  getRiders,
  createRider,
} from "@/src/services/rider.service";

interface Rider {
  _id: string;
  name: string;
  phone: string;
  role: string;
  isActive: boolean;
}

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const loadRiders = async () => {
    try {
      const data = await getRiders();

      setRiders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadRiders();
  }, []);

  const handleCreate = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createRider({
        name,
        phone,
        password,
      });

      alert(
        "Rider created successfully",
      );

      setName("");
      setPhone("");
      setPassword("");

      loadRiders();
    } catch (error) {
      console.error(error);

      alert("Failed to create rider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Form */}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Create Rider
          </h2>

          <form
            onSubmit={handleCreate}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Rider Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-lg p-3"
              required
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full border rounded-lg p-3"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value,
                )
              }
              className="w-full border rounded-lg p-3"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg"
            >
              {loading
                ? "Creating..."
                : "Create Rider"}
            </button>
          </form>
        </div>

        {/* Rider List */}

        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            All Riders
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">
                    Name
                  </th>

                  <th className="text-left py-3">
                    Phone
                  </th>

                  <th className="text-left py-3">
                    Role
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {riders.map((rider) => (
                  <tr
                    key={rider._id}
                    className="border-b"
                  >
                    <td className="py-3">
                      {rider.name}
                    </td>

                    <td className="py-3">
                      {rider.phone}
                    </td>

                    <td className="py-3">
                      {rider.role}
                    </td>

                    <td className="py-3">
                      {rider.isActive
                        ? "Active"
                        : "Inactive"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {riders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No Riders Found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
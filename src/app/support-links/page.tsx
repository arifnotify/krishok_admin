"use client";

import { useEffect, useState } from "react";

import {
  getSupportLinks,
  updateSupportLinks,
} from "@/src/services/support-link.service";

export default function SupportLinksPage() {
  const [form, setForm] = useState({
    whatsapp: "",
    phone: "",
    facebook: "",
    instagram: "",
    messenger: "",
  });

  const [loading, setLoading] = useState(false);

  // LOAD DATA
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getSupportLinks();

      if (data) {
        const {
          _id,
          createdAt,
          updatedAt,
          __v,
          ...clean
        } = data as any;

        setForm(clean);
      }
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  // HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await updateSupportLinks(form);

      console.log("UPDATED:", res);

      alert("Support Links Updated Successfully");
    } catch (err: any) {
      console.log(
        "UPDATE ERROR:",
        err?.response?.data,
      );

      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">

      <h1 className="text-2xl font-bold mb-6">
        Support Links Settings
      </h1>

      <div className="space-y-4">

        <input
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp Link"
          className="w-full border p-3 rounded"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border p-3 rounded"
        />

        <input
          name="facebook"
          value={form.facebook}
          onChange={handleChange}
          placeholder="Facebook URL"
          className="w-full border p-3 rounded"
        />

        <input
          name="instagram"
          value={form.instagram}
          onChange={handleChange}
          placeholder="Instagram URL"
          className="w-full border p-3 rounded"
        />

        <input
          name="messenger"
          value={form.messenger}
          onChange={handleChange}
          placeholder="Messenger URL"
          className="w-full border p-3 rounded"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded w-full"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
}
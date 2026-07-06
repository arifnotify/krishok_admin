"use client";

import { useState } from "react";

import Cookies from "js-cookie";
import { loginAdmin } from "@/src/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const data =
        await loginAdmin(
          email,
          password,
        );

      // SAVE TOKEN
      Cookies.set(
        "token",
        data.access_token,
      );

      // redirect
      window.location.href =
        "/dashboard";
    } catch (err) {
      console.log(err);

      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="w-[400px] p-6 bg-white rounded-2xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg"
        >
          {loading
            ? "Loading..."
            : "Login"}
        </button>

      </div>

    </div>
  );
}
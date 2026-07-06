"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Moon,
  Shield,
} from "lucide-react";
import Cookies from "js-cookie";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="relative">

      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl hover:bg-gray-100 p-2 transition"
      >

        <div className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
          A
        </div>

        <div className="hidden lg:block text-left">
          <p className="font-semibold text-gray-800">
            Admin
          </p>
          <p className="text-xs text-gray-500">
            Super Admin
          </p>
        </div>

      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white border shadow-xl rounded-xl overflow-hidden z-50">

          {/* Header */}
          <div className="p-4 border-b">
            <p className="font-semibold text-gray-800">
              Admin Profile
            </p>
            <p className="text-xs text-gray-500">
              Manage your account
            </p>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">

            <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg">
              <User size={18} />
              <span className="text-sm">My Profile</span>
            </button>

            <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </button>

            <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg">
              <Shield size={18} />
              <span className="text-sm">Security</span>
            </button>

            <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg">
              <Moon size={18} />
              <span className="text-sm">Dark Mode</span>
            </button>

          </div>

          {/* Logout */}
          <div className="border-t p-2">

            <button
              onClick={logout}
              className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">
                Logout
              </span>
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
"use client";

import { Menu, Bell, Search, CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const today = format(new Date(), "EEEE, dd MMM yyyy");

  return (
    <header className="sticky top-0 z-40 h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-5">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Welcome back, Admin 👋
          </p>
        </div>

      </div>

      {/* Center Search */}
      <div className="hidden md:flex items-center">

        <div className="relative w-[400px]">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search orders, products..."
            className="
            w-full
            h-11
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            pl-11
            pr-4
            outline-none
            focus:ring-2
            focus:ring-pink-500
            transition
          "
          />

        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Date */}
        <div className="hidden xl:flex items-center gap-2 text-gray-600">

          <CalendarDays size={18} />

          <span className="text-sm">
            {today}
          </span>

        </div>

        {/* Notification */}
        <button
          className="
          relative
          w-11
          h-11
          rounded-xl
          bg-gray-100
          hover:bg-gray-200
          transition
          flex
          items-center
          justify-center
        "
        >
          <Bell size={20} />

          <span
            className="
            absolute
            -top-1
            -right-1
            w-5
            h-5
            rounded-full
            bg-red-500
            text-white
            text-[10px]
            flex
            items-center
            justify-center
          "
          >
            3
          </span>

        </button>

        {/* Profile */}
        <button
          className="
          flex
          items-center
          gap-3
          rounded-xl
          hover:bg-gray-100
          p-2
          transition
        "
        >

          <div
            className="
            w-11
            h-11
            rounded-full
            bg-gradient-to-r
            from-pink-500
            to-orange-500
            flex
            items-center
            justify-center
            text-white
            font-bold
          "
          >
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

      </div>

    </header>
  );
}
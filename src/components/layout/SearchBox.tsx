"use client";

import { Search } from "lucide-react";

interface SearchBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search orders, products...",
}: SearchBoxProps) {
  return (
    <div className="relative w-full max-w-[420px]">

      {/* Icon */}
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          h-11
          rounded-xl
          border
          border-gray-200
          bg-white
          pl-11
          pr-4
          text-sm
          outline-none
          transition
          focus:ring-2
          focus:ring-pink-500
          focus:border-pink-500
          shadow-sm
        "
      />

    </div>
  );
}
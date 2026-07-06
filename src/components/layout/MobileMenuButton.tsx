"use client";

import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function MobileMenuButton({
  open,
  setOpen,
}: MobileMenuButtonProps) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="
        lg:hidden
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
      {open ? (
        <X size={20} />
      ) : (
        <Menu size={20} />
      )}
    </button>
  );
}
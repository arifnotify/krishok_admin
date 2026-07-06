"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();

  // split path
  const pathParts = pathname
    .split("/")
    .filter((part) => part);

  return (
    <div className="flex items-center text-sm text-gray-500">

      {/* Home */}
      <Link
        href="/dashboard"
        className="hover:text-pink-500 transition"
      >
        Dashboard
      </Link>

      {/* Dynamic Parts */}
      {pathParts.map((part, index) => {
        const href =
          "/" + pathParts.slice(0, index + 1).join("/");

        const isLast =
          index === pathParts.length - 1;

        return (
          <div
            key={href}
            className="flex items-center"
          >

            <ChevronRight
              size={16}
              className="mx-1 text-gray-400"
            />

            {isLast ? (
              <span className="text-gray-800 font-medium capitalize">
                {part}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-pink-500 transition capitalize"
              >
                {part}
              </Link>
            )}

          </div>
        );
      })}

    </div>
  );
}
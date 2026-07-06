"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";
import { menu } from "@/src/lib/menu";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#0F172A] text-white flex flex-col justify-between border-r border-slate-800">
      {/* Logo */}
      <div>
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-pink-500">
              Food Admin
            </h1>
            <p className="text-xs text-slate-400">
              Delivery Management
            </p>
          </div>
        </div>

        <div className="px-4 py-6 overflow-y-auto h-[calc(100vh-180px)]">
          {menu.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="text-[11px] uppercase text-slate-500 font-semibold mb-3 px-2">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all
                      ${
                        active
                          ? "bg-pink-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <Icon size={19} />

                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center font-bold">
            A
          </div>

          <div>
            <p className="font-semibold">
              Admin
            </p>

            <p className="text-xs text-slate-400">
              Super Admin
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-red-500 py-3 hover:bg-red-600 transition"
        >
          <LogOut size={18} />

          Logout
        </button>
      </div>
    </aside>
  );
}
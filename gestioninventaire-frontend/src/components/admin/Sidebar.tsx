"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  TestTubeDiagonal,
  LandPlot,
  Grid2x2Check,
  ClipboardClock,
  LogOut,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { removeToken } from "@/src/Services/tokenService";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Service & Laboratoire",
    href: "/admin/dashboard/services-laboratoires",
    icon: TestTubeDiagonal,
  },
   {
    label: "mouvement",
    href: "/admin/dashboard/mouvement",
    icon:LandPlot,
  },
  {
    label: "Campagnes",
    href: "/admin/dashboard/campaigns",
    icon: Grid2x2Check,
  },
  {
    label: "Rapports",
    href: "/reports",
    icon: ClipboardClock,
  },
];

export default function AdminSidebar() {

  const router = useRouter();
  const handleLogout = () => {
  
      removeToken();
  
      router.replace("/login");
  };
  
  return (
    <aside className="group m-1 rounded-t-xl sticky top-0 h-screen w-16 hover:w-55 transition-all duration-300 bg-slate-900 text-white overflow-hidden shadow-xl">

      <div className="flex justify-center py-1 border-b border-slate-700">
        <img src="/images/logo.jpg"alt="Logo"  className="w-12 h-12 rounded-lg object-cover"/>
      </div>

      <nav className="mt-5 flex flex-col gap-2 px-2">

        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 rounded-lg px-3 py-3 hover:bg-slate-800 transition-colors"
          >
            <item.icon size={17} className="flex-shrink-0" />

            <span
              className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200"
            >
              {item.label}
            </span>

          </Link>
        ))}

      </nav>

      <div className="absolute bottom-4 left-0 w-full px-2">

        <button
        onClick={handleLogout}
          className="flex items-center gap-4 w-full rounded-lg px-3 py-3 hover:bg-slate-800 transition-colors "
        >
          <LogOut size={17} />

          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            Déconnexion
          </span>

        </button>

      </div>

    </aside>
  );
}
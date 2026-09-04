"use client";

import type { ReactNode } from "react";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AdminSidebar from "@/src/components/admin/Sidebar";
import AdminNavbar from "@/src/components/admin/Navbar";

export default function AdminLayout({children,}: {children: ReactNode;}) {
return (
<ProtectedRoute allowedRoles={["ADMIN"]}>

        <div className="min-h-screen bg-slate-100 flex w-full min-w-0">

            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">

                <AdminNavbar />

                <main className="flex-1 p-6">
                    {children}
                </main>

            </div>

        </div>

    </ProtectedRoute>
);

}

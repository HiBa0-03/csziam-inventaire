"use client";

import type { ReactNode } from "react";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AgentSidebar from "@/src/components/agent/Sidebar";
import AgentNavbar from "@/src/components/agent/Navbar";

export default function AgentLayout({children,}: {children: ReactNode;}) {
return (
<ProtectedRoute allowedRoles={["AGENT_INVENTAIRE"]}>

        <div className="min-h-screen bg-slate-100 flex">

            <AgentSidebar />

            <div className="flex-1 flex flex-col">

                <AgentNavbar />

                <main className="flex-1 p-6">
                    {children}
                </main>

            </div>

        </div>

    </ProtectedRoute>
);


}

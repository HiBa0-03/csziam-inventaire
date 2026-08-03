import ProtectedRoute from "@/src/components/ProtectedRoute";
import Sidebar from "@/src/components/Sidebar";
import Navbar from "@/src/components/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <ProtectedRoute>
            <div className="min-h-screen">

                <Navbar />

                <div className="flex">
                    <Sidebar />

                    <div className="flex-1 p-6">
                        <main>
                            {children}
                        </main>
                    </div>

                </div>

            </div>
        </ProtectedRoute>
    );
}
import ResponsableSidebar from "@/src/components/responsable/Sidebar";
import ResponsableNavbar from "@/src/components/responsable/Navbar";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

export default function ResponsableDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <ProtectedRoute allowedRoles={["RESPONSABLE"]}>

      <div className="min-h-screen flex bg-slate-100">

        <ResponsableSidebar />

        <div className="flex-1 min-w-0">

          <ResponsableNavbar />

          <main className="p-6">
            {children}
          </main>

        </div>

      </div>

    </ProtectedRoute>

  );
}
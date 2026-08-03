"use client";

import { getToken } from "@/src/Services/tokenService";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    console.log("ProtectedRoute exécuté");

    const token = getToken();

    console.log("Token :", token);

    if (!token) {
        router.push("/login");
        return;
    }

    setIsAuthenticated(true);

}, [router]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
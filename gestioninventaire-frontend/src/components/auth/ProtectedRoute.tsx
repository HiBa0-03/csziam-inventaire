"use client";

import { getToken } from "@/src/Services/tokenService";
import { getCurrentUser } from "@/src/Services/authService";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
children: ReactNode;
allowedRoles?: string[];
}

export default function ProtectedRoute({
children,
allowedRoles,
}: ProtectedRouteProps) {

const router = useRouter();

const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {

    const checkAuthentication = async () => {

        console.log("ProtectedRoute exécuté");

        const token = getToken();

        console.log("Token :", token);

        if (!token) {
            router.replace("/login");
            return;
        }

        try {

            const currentUser = await getCurrentUser();

            console.log("Utilisateur connecté :", currentUser);

            if (
                allowedRoles &&
                allowedRoles.length > 0 &&
                !allowedRoles.includes(currentUser.roleUtilisateur)
            ) {

                console.log("Accès refusé pour ce rôle");

                if (currentUser.roleUtilisateur === "ADMIN") {
                    router.replace("/admin/dashboard");
                } else if (currentUser.roleUtilisateur === "AGENT") {
                    router.replace("/agent/dashboard");
                } else {
                    router.replace("/login");
                }

                return;
            }

            setIsAuthenticated(true);

        } catch (error) {

            console.error(
                "Erreur lors de la vérification de l'utilisateur :",
                error
            );

            router.replace("/login");

        } finally {

            setIsLoading(false);

        }
    };

    checkAuthentication();

}, [router, allowedRoles]);

if (isLoading) {
    return null;
}

if (!isAuthenticated) {
    return null;
}

return <>{children}</>;


}

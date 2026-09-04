"use client";

import type { FormEvent } from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthenticationRequest } from "@/src/types/AuthenticationRequest";
import { login, getCurrentUser } from "@/src/Services/authService";

export default function Login() {
  const router = useRouter();

  const [authRequest, setAuthRequest] =
    useState<AuthenticationRequest>({
      email: "",
      motDePasse: "",
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(authRequest);

      const utilisateur = await getCurrentUser();

      console.log("Utilisateur connecté :", utilisateur);

      switch (utilisateur.roleUtilisateur) {
        case "ADMIN":
          router.replace("/admin/dashboard");
          break;

        case "AGENT_INVENTAIRE":
          router.replace("/agent/dashboard");
          break;

        case "RESPONSABLE":
          router.replace("/responsable/dashboard");
          break;

        default:
          setError("Rôle utilisateur non reconnu.");
      }

    } catch (error) {
      console.log("Erreur login :", error);

      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-slate-900 px-8 py-8 text-center">
            <img
              src="/images/logo.jpg"
              alt="Logo CSZIAM"
              className="w-20 h-20 rounded-xl object-cover mx-auto mb-4"
            />

            <h1 className="text-2xl font-bold text-white">
              Gestion de patrimoine
            </h1>

            <p className="text-slate-300 text-sm mt-2">
              Centre CSZIAM
            </p>

          </div>
          <div className="p-8">

            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Connexion
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Connectez-vous à votre espace utilisateur.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Adresse email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="exemple@csziam.ma"
                  value={authRequest.email}
                  onChange={(e) =>
                    setAuthRequest({
                      ...authRequest,
                      email: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Mot de passe
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={authRequest.motDePasse}
                  onChange={(e) =>
                    setAuthRequest({
                      ...authRequest,
                      motDePasse: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Connexion..."
                  : "Se connecter"}
              </button>

            </form>

          </div>

        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          © 2026 CSZIAM — Gestion de patrimoine
        </p>

      </div>

    </main>
  );
}
"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { UtilisateurResponse } from "@/src/types/UtilisateurResponse";

type UserCardProps = {
  utilisateurs: UtilisateurResponse[];
};

export default function UserCard({ utilisateurs }: UserCardProps) {
  const derniersUtilisateurs = utilisateurs.slice(-3).reverse();

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">

      <div className="flex justify-between items-center mb-3">

        <h2 className="text-lg font-semibold text-slate-800">
          Utilisateurs
        </h2>

        <Link
          href="/admin/dashboard/utilisateurs"
          className="text-sm text-blue-600 hover:underline"
        >
          View all →
        </Link>

      </div>

      <div className="space-y-2">

        {derniersUtilisateurs.map((user) => (

          <div
            key={user.id}
            className="flex justify-between items-center border-b pb-2 last:border-none"
          >

            <div className="flex items-center gap-3">

              <div className="bg-slate-100 p-2 rounded-full">
                <User size={18} />
              </div>

              <span className="font-medium">
                {user.nom}
              </span>

            </div>

            <span className="text-sm text-gray-500">
              {user.roleUtilisateur}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}
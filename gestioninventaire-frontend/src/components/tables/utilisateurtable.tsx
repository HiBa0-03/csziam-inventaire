"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { UtilisateurResponse } from "../../types/UtilisateurResponse";

type UtilisateurTableProps = {
    utilisateurs: UtilisateurResponse[];
    onDelete: (id: number) => void;
};

export default function Utilisateurtable({
    utilisateurs,
    onDelete
}: UtilisateurTableProps) {

    const getRoleStyle = (role: string) => {

        switch (role?.toUpperCase()) {

            case "ADMIN":
                return "bg-red-100 text-red-700";

            case "RESPONSABLE":
                return "bg-blue-100 text-blue-700";

            case "AGENT":
                return "bg-green-100 text-green-700";

            default:
                return "bg-gray-100 text-gray-700";
        }

    };

    return (

        <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[800px] border-collapse text-sm">

                <thead>

                    <tr className="bg-gray-50 border-b border-gray-200">

                        <th className="p-3 text-left w-10">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                            />
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Nom
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Email
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Téléphone
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Rôle
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {utilisateurs.map((utilisateur) => (

                        <tr
                            key={utilisateur.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >

                            <td className="p-3">

                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                                />

                            </td>

                            <td className="p-3 font-medium text-gray-800">
                                {utilisateur.nom}
                            </td>

                            <td className="p-3 text-gray-500">
                                {utilisateur.email}
                            </td>

                            <td className="p-3 text-gray-500">
                                {utilisateur.telephone}
                            </td>

                            <td className="p-3">

                                <span
                                    className={`text-xs font-medium px-3 py-1 rounded-full ${getRoleStyle(
                                        utilisateur.roleUtilisateur
                                    )}`}
                                >
                                    {utilisateur.roleUtilisateur}
                                </span>

                            </td>

                            <td className="p-3">

                                <div className="flex gap-3">

                                    <Link
                                        href={`/admin/dashboard/utilisateurs/update/${utilisateur.id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Pencil size={16} />
                                    </Link>

                                    <button
                                        onClick={() =>
                                            onDelete(utilisateur.id)
                                        }
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}
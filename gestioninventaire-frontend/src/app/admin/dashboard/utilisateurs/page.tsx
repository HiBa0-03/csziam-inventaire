"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import {
    getUtilisateurs,
    deleteUtilisateur
} from "@/src/Services/utilisateurService";

import { UtilisateurResponse } from "@/src/types/UtilisateurResponse";

import Utilisateurtable from "@/src/components/tables/utilisateurtable";

export default function UtilisateursPage() {

    const [utilisateurs, setUtilisateurs] =
        useState<UtilisateurResponse[]>([]);

    const [search, setSearch] = useState("");

    const [deleteId, setDeleteId] =
        useState<number | null>(null);

    useEffect(() => {

        fetchUtilisateurs();

    }, []);

    const fetchUtilisateurs = async () => {

        try {

            const data = await getUtilisateurs();

            setUtilisateurs(data);

        } catch (error) {

            console.log(error);

        }

    };


    const filteredUtilisateurs = utilisateurs.filter(
        (utilisateur) =>
            utilisateur.nom
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            utilisateur.email
                .toLowerCase()
                .includes(search.toLowerCase())
    );


    const handleDelete = async () => {

        if (deleteId === null) return;

        try {

            await deleteUtilisateur(deleteId);

            setUtilisateurs((prev) =>
                prev.filter(
                    (utilisateur) =>
                        utilisateur.id !== deleteId
                )
            );

            setDeleteId(null);

        } catch (error) {

            console.log(error);

            alert(
                "Erreur lors de la suppression de l'utilisateur."
            );

        }

    };


    return (

        <div className="flex flex-col gap-6">

            <div className="flex justify-between items-center">

                <h1 className="flex items-center text-2xl font-bold">

                    <Link
                        href="/admin/dashboard"
                        className="mr-2"
                    >
                        <ChevronLeft />
                    </Link>

                    Gestion des utilisateurs

                </h1>


                <Link
                    href="/admin/dashboard/utilisateurs/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                    + Ajouter un utilisateur
                </Link>

            </div>

            <input
                type="text"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                placeholder="Rechercher par nom ou email..."
                className="w-80 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="bg-white rounded-xl shadow-sm p-5">

                <Utilisateurtable
                    utilisateurs={filteredUtilisateurs}
                    onDelete={setDeleteId}
                />

            </div>


            {/* POPUP SUPPRESSION */}

            {deleteId !== null && (

                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl shadow-xl w-[400px] p-6">

                        <h2 className="text-lg font-semibold text-gray-800">
                            Supprimer l'utilisateur ?
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            Êtes-vous sûr de vouloir supprimer
                            cet utilisateur ? Cette action est
                            irréversible.
                        </p>


                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() =>
                                    setDeleteId(null)
                                }
                                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                            >
                                Annuler
                            </button>


                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Supprimer
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}
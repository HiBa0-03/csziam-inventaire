"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    ClipboardCheck,
    Plus,
    CalendarCheck
} from "lucide-react";

import { getCampagnes } from "@/src/Services/campagneService";
import { CampagneResponse } from "@/src/types/CampagneResponse";

export default function CampagnesPage() {

    const [campagnes, setCampagnes] =
        useState<CampagneResponse[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchCampagnes = async () => {

            try {

                const data = await getCampagnes();

                setCampagnes(data);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchCampagnes();

    }, []);

    return (

        <div className="flex flex-col gap-6">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="bg-blue-100 p-3 rounded-xl">

                        <CalendarCheck size={24} className="text-blue-600"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Campagnes d'inventaire
                        </h1> 
                        <p className="text-sm text-gray-500">
                            Gestion des campagnes d'inventaire
                        </p>

                    </div>

                </div>


                <Link href="/admin/dashboard/campaigns/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">

                    <Plus size={17} />

                    Nouvelle campagne

                </Link>

            </div>

            {loading ? (

                <div className="flex justify-center py-20">

                    <p className="text-gray-500">
                        Chargement des campagnes...
                    </p>

                </div>

            ) : campagnes.length === 0 ? (

                <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">

                    <p className="text-gray-500">
                        Aucune campagne d'inventaire.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {campagnes.map((campagne) => (

                        <Link
                            key={campagne.id}
                            href={`/admin/dashboard/campaigns/${campagne.id}`}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all"
                        >
                            <div className="flex justify-between items-start">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Campagne
                                    </p>

                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {campagne.annee}
                                    </h2>

                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        campagne.statut === "EN_COURS"
                                            ? "bg-green-100 text-green-700"
                                            : campagne.statut === "AVENIR"
                                            ? "bg-blue-100 text-blue-700"
                                            : campagne.statut === "TERMINEE"
                                            ? "bg-gray-100 text-gray-700"
                                            : campagne.statut === "EXPIREE"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-600"
                                    }`}>

                                    {campagne.statut === "EN_COURS"
                                        ? "En cours"
                                        : campagne.statut === "AVENIR"
                                        ? "À venir"
                                        : campagne.statut === "TERMINEE"
                                        ? "Terminée"
                                        : campagne.statut === "EXPIREE"
                                        ? "Expirée"
                                        : campagne.statut}

                                </span>

                            </div>

                            <div className="flex items-center gap-2 mt-5 text-sm text-gray-500">

                                <CalendarDays size={16} />

                                <span>
                                    {campagne.dateDebut}
                                    {" → "}
                                    {campagne.dateFin}
                                </span>

                            </div>

                            <div className="mt-6">

                                <div className="flex justify-between items-center mb-2">

                                    <div className="flex items-center gap-2 text-sm text-gray-600">

                                        <ClipboardCheck size={16} />

                                        <span>
                                            Inventaire
                                        </span>

                                    </div>

                                    <span className="text-sm font-semibold text-gray-800">
                                        {campagne.progression}%
                                    </span>

                                </div>

                                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all"
                                        style={{
                                            width: `${campagne.progression}%`
                                        }}
                                    />

                                </div>


                                <p className="text-xs text-gray-500 mt-2">

                                    {campagne.articlesInventories}
                                    {" / "}
                                    {campagne.totalArticles}
                                    {" articles vérifiés"}

                                </p>

                            </div>

                        </Link>

                    ))}

                </div>

            )}

        </div>

    );
}

"use client";

import { useEffect, useState } from "react";

import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Search,
    Loader2,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
    getCurrentUser
} from "@/src/Services/authService";

import {
    getCampagnes
} from "@/src/Services/campagneService";

import {
    getInventairesByCampagne
} from "@/src/Services/inventaireService";

import {
    UtilisateurResponse
} from "@/src/types/UtilisateurResponse";

import {
    InventaireResponse
} from "@/src/types/InventaireResponse";


export default function AgentHistoriquePage() {

    const router = useRouter();


    const [user, setUser] =
        useState<UtilisateurResponse | null>(null);


    const [inventaires, setInventaires] =
        useState<InventaireResponse[]>([]);


    const [search, setSearch] =
        useState("");


    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const fetchData = async () => {

            try {

                const currentUser =
                    await getCurrentUser();


                if (
                    currentUser.roleUtilisateur !==
                    "AGENT_INVENTAIRE"
                ) {

                    router.push("/agent/dashboard");

                    return;
                }


                setUser(
                    currentUser
                );


                const campagnes =
                    await getCampagnes();


                const campagneEnCours =
                    campagnes.find(
                        (c) =>
                            c.statut === "EN_COURS"
                    );


                if (!campagneEnCours) {

                    setLoading(false);

                    return;
                }


                const data =
                    await getInventairesByCampagne(
                        campagneEnCours.id
                    );


                const mesInventaires =
                    data.filter(
                        (i) =>
                            i.agentId ===
                            currentUser.id
                    );


                setInventaires(
                    mesInventaires
                );


            } catch (error) {

                console.error(
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchData();

    }, [router]);


    const inventairesFiltres =
        inventaires.filter(
            (inventaire) => {

                const value =
                    search.toLowerCase();


                return (

                    inventaire.articleDesignation
                        .toLowerCase()
                        .includes(value)

                    ||

                    inventaire.commentaire
                        ?.toLowerCase()
                        .includes(value)

                );

            }
        );


    const inventairesTries =
        inventairesFiltres
            .slice()
            .sort(
                (a, b) =>
                    new Date(
                        b.dateVerification
                    ).getTime()
                    -
                    new Date(
                        a.dateVerification
                    ).getTime()
            );


    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-[400px]">

                <Loader2
                    size={22}
                    className="animate-spin text-gray-400"
                />

                <span className="ml-2 text-gray-500">

                    Chargement...

                </span>

            </div>

        );

    }


    return (

        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">

                <button
                    onClick={() =>
                        router.push(
                            "/agent/dashboard"
                        )
                    }
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >

                    <ArrowLeft
                        size={22}
                    />

                </button>


                <div>

                    <h1 className="text-2xl font-bold text-gray-800">

                        Mon historique

                    </h1>


                    <p className="text-sm text-gray-500 mt-1">

                        Historique des articles
                        vérifiés par{" "}
                        {user?.nom}.

                    </p>

                </div>

            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                <div className="relative">

                    <Search
                        size={19}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />


                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Rechercher..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-50">

                            <tr>
                                <th className="text-left px-5 py-3 font-medium text-gray-600">
                                    Article
                                </th>

                                <th className="text-left px-5 py-3 font-medium text-gray-600">
                                    Date
                                </th>

                                <th className="text-left px-5 py-3 font-medium text-gray-600">
                                    Présence
                                </th>
                                <th className="text-left px-5 py-3 font-medium text-gray-600">
                                    Commentaire
                                </th>
                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {inventairesTries.length === 0 ? (

                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-gray-500">
                                        Aucun inventaire trouvé.
                                    </td>
                                </tr>
                            ) : (

                                inventairesTries.map(
                                    (
                                        inventaire
                                    ) => (

                                        <tr
                                            key={
                                                inventaire.id
                                            }
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4 font-medium text-gray-800">

                                                {
                                                    inventaire.articleDesignation
                                                }

                                            </td>


                                            <td className="px-5 py-4 text-gray-600">

                                                {
                                                    inventaire.dateVerification
                                                }

                                            </td>


                                            <td className="px-5 py-4">

                                                {inventaire.statutPresence ===
                                                "PRESENT" ? (

                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">

                                                        <CheckCircle
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        Présent

                                                    </span>

                                                ) : (

                                                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">

                                                        <XCircle
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        Absent

                                                    </span>

                                                )}

                                            </td>


                                            <td className="px-5 py-4 text-gray-600">

                                                {
                                                    inventaire.commentaire ||
                                                    "Aucun commentaire."
                                                }

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}
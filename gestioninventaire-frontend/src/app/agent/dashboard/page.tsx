"use client";

import { useEffect, useState } from "react";

import {
    ClipboardCheck,
    CheckCircle,
    XCircle,
    Package,
    Calendar,
    ArrowRight,
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
    CampagneResponse
} from "@/src/types/CampagneResponse";

import {
    InventaireResponse
} from "@/src/types/InventaireResponse";


export default function AgentDashboardPage() {

    const router = useRouter();


    const [user, setUser] =
        useState<UtilisateurResponse | null>(null);


    const [campagne, setCampagne] =
        useState<CampagneResponse | null>(null);


    const [inventaires, setInventaires] =
        useState<InventaireResponse[]>([]);


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


                setUser(currentUser);


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


                setCampagne(campagneEnCours);


                const inventairesCampagne =
                    await getInventairesByCampagne(
                        campagneEnCours.id
                    );


                const mesInventaires =
                    inventairesCampagne.filter(
                        (inventaire) =>
                            inventaire.agentId ===
                            currentUser.id
                    );


                setInventaires(
                    mesInventaires
                );


            } catch (error) {

                console.error(
                    "Erreur dashboard agent :",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchData();

    }, [router]);


    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-[400px]">

                <div className="flex items-center gap-3 text-gray-500">

                    <Loader2
                        size={22}
                        className="animate-spin"
                    />

                    <span>
                        Chargement...
                    </span>

                </div>

            </div>

        );

    }


    const presents =
        inventaires.filter(
            (i) =>
                i.statutPresence ===
                "PRESENT"
        ).length;


    const absents =
        inventaires.filter(
            (i) =>
                i.statutPresence ===
                "ABSENT"
        ).length;


    return (

        <div className="flex flex-col gap-6">


            {/* HEADER */}

            <div>

                <h1 className="text-2xl font-bold text-gray-800">

                    Bonjour{" "}

                    {user?.nom || "Agent"}

                </h1>


                <p className="text-sm text-gray-500 mt-1">

                    Bienvenue dans votre espace
                    d'inventaire.

                </p>

            </div>

            {campagne ? (

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-4">

                            <div className="bg-blue-100 rounded-full p-3">

                                <Calendar
                                    size={24}
                                    className="text-blue-700"
                                />

                            </div>


                            <div>

                                <p className="text-sm text-gray-500">

                                    Campagne en cours

                                </p>


                                <h2 className="text-xl font-bold text-gray-800">

                                    Campagne{" "}
                                    {campagne.annee}

                                </h2>


                                <p className="text-sm text-gray-500 mt-1">

                                    {campagne.dateDebut}
                                    {" → "}
                                    {campagne.dateFin}

                                </p>

                            </div>

                        </div>


                        <button
                            onClick={() =>
                                router.push(
                                    "/agent/dashboard/inventaire"
                                )
                            }
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >

                            Commencer

                            <ArrowRight
                                size={17}
                            />

                        </button>

                    </div>

                </div>

            ) : (

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">

                    <Calendar
                        size={40}
                        className="mx-auto text-gray-300 mb-3"
                    />

                    <h2 className="text-lg font-semibold text-gray-700">

                        Aucune campagne en cours

                    </h2>

                    <p className="text-sm text-gray-500 mt-1">

                        Il n'y a actuellement aucune
                        campagne d'inventaire active.

                    </p>

                </div>

            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                    <div className="flex items-center gap-3">

                        <div className="bg-blue-100 rounded-full p-3">

                            <ClipboardCheck
                                size={22}
                                className="text-blue-700"
                            />

                        </div>


                        <div>

                            <p className="text-sm text-gray-500">

                                Mes inventaires

                            </p>


                            <p className="text-2xl font-bold text-gray-800">

                                {inventaires.length}

                            </p>

                        </div>

                    </div>

                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                    <div className="flex items-center gap-3">

                        <div className="bg-green-100 rounded-full p-3">

                            <CheckCircle
                                size={22}
                                className="text-green-700"
                            />

                        </div>


                        <div>

                            <p className="text-sm text-gray-500">

                                Présents

                            </p>


                            <p className="text-2xl font-bold text-gray-800">

                                {presents}

                            </p>

                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                    <div className="flex items-center gap-3">

                        <div className="bg-red-100 rounded-full p-3">

                            <XCircle
                                size={22}
                                className="text-red-700"
                            />

                        </div>


                        <div>

                            <p className="text-sm text-gray-500">

                                Absents

                            </p>


                            <p className="text-2xl font-bold text-gray-800">

                                {absents}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {campagne && (

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

                    <div className="flex justify-between items-center mb-3">

                        <div>

                            <h2 className="text-lg font-semibold text-gray-800">

                                Ma progression

                            </h2>


                            <p className="text-sm text-gray-500 mt-1">

                                Articles déjà vérifiés
                                par vous.

                            </p>

                        </div>


                        <span className="text-lg font-bold text-blue-600">

                            {campagne.totalArticles > 0
                                ? Math.round(
                                    (inventaires.length /
                                        campagne.totalArticles) *
                                    100
                                )
                                : 0
                            }%

                        </span>

                    </div>


                    <div className="w-full bg-gray-200 rounded-full h-3">

                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{
                                width: `${
                                    campagne.totalArticles > 0
                                        ? Math.min(
                                            100,
                                            (inventaires.length /
                                                campagne.totalArticles) *
                                            100
                                        )
                                        : 0
                                }%`
                            }}
                        />

                    </div>

                </div>

            )}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">

                <div className="p-5 border-b border-gray-100 flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-semibold text-gray-800">

                            Mes dernières vérifications

                        </h2>


                        <p className="text-sm text-gray-500 mt-1">

                            Les derniers articles que
                            vous avez inventoriés.

                        </p>

                    </div>


                    {inventaires.length > 0 && (

                        <button
                            onClick={() =>
                                router.push(
                                    "/agent/dashboard/historique"
                                )
                            }
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >

                            Voir tout

                        </button>

                    )}

                </div>


                {inventaires.length === 0 ? (

                    <div className="py-12 text-center">

                        <Package
                            size={40}
                            className="mx-auto text-gray-300 mb-3"
                        />

                        <p className="text-sm text-gray-500">

                            Vous n'avez encore
                            inventorié aucun article.

                        </p>

                    </div>

                ) : (

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

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                                {inventaires
                                    .slice()
                                    .sort(
                                        (
                                            a,
                                            b
                                        ) =>
                                            new Date(
                                                b.dateVerification
                                            ).getTime() -
                                            new Date(
                                                a.dateVerification
                                            ).getTime()
                                    )
                                    .slice(0, 5)
                                    .map(
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

                                            </tr>

                                        )
                                    )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}
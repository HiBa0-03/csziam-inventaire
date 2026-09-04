"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Search,
    History,
    ArrowRight,
    Package,
    User,
    MapPin,
    Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/src/Services/authService";
import { getArticles } from "@/src/Services/articleService";
import { getMouvements } from "@/src/Services/MouvementService";

import { UtilisateurResponse } from "@/src/types/UtilisateurResponse";
import { ArticleResponse } from "@/src/types/ArticleResponse";
import { MouvementResponse } from "@/src/types/MouvementResponse";

export default function ResponsableMouvementsPage() {
    const router = useRouter();

    const [user, setUser] =
        useState<UtilisateurResponse | null>(null);

    const [articles, setArticles] =
        useState<ArticleResponse[]>([]);

    const [mouvements, setMouvements] =
        useState<MouvementResponse[]>([]);

    const [search, setSearch] =
        useState("");

    const [typeFilter, setTypeFilter] =
        useState("TOUS");

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const currentUser =
                    await getCurrentUser();

                if (
                    currentUser.roleUtilisateur !==
                    "RESPONSABLE"
                ) {
                    router.push("/responsable/dashboard");
                    return;
                }

                setUser(currentUser);

                const [
                    articlesData,
                    mouvementsData,
                ] = await Promise.all([
                    getArticles(),
                    getMouvements(),
                ]);

                setArticles(
                    articlesData
                );

                setMouvements(
                    mouvementsData
                );
            } catch (error) {
                console.error(
                    "Erreur chargement mouvements responsable :",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [router]);

    const mesArticles = useMemo(() => {
        if (!user) {
            return [];
        }

        if (user.serviceId != null) {
            return articles.filter(
                (article) =>
                    article.serviceId ===
                    user.serviceId
            );
        }

        if (user.laboratoireId != null) {
            return articles.filter(
                (article) =>
                    article.laboratoireId ===
                    user.laboratoireId
            );
        }

        return [];
    }, [articles, user]);

    const mesArticleIds = useMemo(
        () =>
            new Set(
                mesArticles.map(
                    (article) => article.id
                )
            ),
        [mesArticles]
    );

    const mesMouvements =
        mouvements.filter(
            (mouvement) =>
                mesArticleIds.has(
                    mouvement.articleId
                )
        );

    const mouvementsFiltres =
        mesMouvements
            .filter((mouvement) => {

                const value =
                    search
                        .toLowerCase()
                        .trim();

                const correspondRecherche =
                    !value ||
                    mouvement.articleDesignation
                        ?.toLowerCase()
                        .includes(value) ||
                    mouvement.motif
                        ?.toLowerCase()
                        .includes(value) ||
                    mouvement.utilisateurNom
                        ?.toLowerCase()
                        .includes(value) ||
                    mouvement.ancienneLocalisation
                        ?.toLowerCase()
                        .includes(value) ||
                    mouvement.nouvelleLocalisation
                        ?.toLowerCase()
                        .includes(value);

                const correspondType =
                    typeFilter ===
                        "TOUS" ||
                    mouvement.typeMouvement ===
                        typeFilter;

                return (
                    correspondRecherche &&
                    correspondType
                );
            })
            .sort((a, b) => {

                const dateA =
                    new Date(
                        a.date
                    ).getTime();

                const dateB =
                    new Date(
                        b.date
                    ).getTime();

                if (dateA !== dateB) {
                    return dateB - dateA;
                }

                return (
                    (b.id ?? 0) -
                    (a.id ?? 0)
                );
            });

    const getTypeLabel = (
        type?: string
    ) => {
        switch (type) {
            case "TRANSFERT":
                return "Transfert";

            case "AFFECTATION":
                return "Affectation";

            case "PRET":
                return "Prêt";

            case "RETOUR":
                return "Retour";

            case "REPARATION":
                return "Réparation";

            case "MAINTENANCE":
                return "Maintenance";

            case "SORTIE_DEFINITIVE":
                return "Sortie définitive";

            default:
                return type || "Mouvement";
        }
    };

    const getTypeClass = (
        type?: string
    ) => {
        switch (type) {
            case "TRANSFERT":
                return "bg-blue-100 text-blue-700";

            case "AFFECTATION":
                return "bg-purple-100 text-purple-700";

            case "PRET":
                return "bg-orange-100 text-orange-700";

            case "RETOUR":
                return "bg-green-100 text-green-700";

            case "REPARATION":
            case "MAINTENANCE":
                return "bg-yellow-100 text-yellow-700";

            case "SORTIE_DEFINITIVE":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">

                <Loader2
                    size={24}
                    className="animate-spin text-blue-600"
                />

                <span className="ml-3 text-gray-500">
                    Chargement des mouvements...
                </span>

            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">

                <div className="bg-blue-100 p-3 rounded-xl">

                    <History
                        size={24}
                        className="text-blue-600"
                    />

                </div>

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Mouvements
                    </h1>

                    <p className="text-sm text-gray-500">
                        Historique des mouvements de votre patrimoine.
                    </p>

                </div>

            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            placeholder="Rechercher un matériel, une personne, un motif..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) =>
                            setTypeFilter(
                                e.target.value
                            )
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >

                        <option value="TOUS">
                            Tous les mouvements
                        </option>

                        <option value="AFFECTATION">
                            Affectations
                        </option>

                        <option value="TRANSFERT">
                            Transferts
                        </option>

                        <option value="PRET">
                            Prêts
                        </option>

                        <option value="RETOUR">
                            Retours
                        </option>

                        <option value="REPARATION">
                            Réparations
                        </option>

                        <option value="MAINTENANCE">
                            Maintenances
                        </option>

                        <option value="SORTIE_DEFINITIVE">
                            Sorties définitives
                        </option>

                    </select>

                </div>

            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                <p className="text-sm text-gray-500">
                    Mouvements trouvés
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-1">
                    {mouvementsFiltres.length}
                </p>

            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Historique des mouvements
                    </h2>

                    <p className="text-sm text-gray-500">
                        Les mouvements concernant
                        uniquement votre patrimoine.
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-gray-50 border-b">

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Matériel
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Date
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Type
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Localisation
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Personne
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Motif
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {mouvementsFiltres.length ===
                                0 ? (

                                <tr>

                                    <td
                                        colSpan={6}
                                        className="text-center px-6 py-12 text-gray-500"
                                    >
                                        Aucun mouvement
                                        trouvé.
                                    </td>

                                </tr>

                            ) : (

                                mouvementsFiltres.map(
                                    (mouvement) => (

                                        <tr
                                            key={
                                                mouvement.id
                                            }
                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="bg-gray-100 p-2 rounded-lg">

                                                        <Package
                                                            size={17}
                                                            className="text-gray-600"
                                                        />

                                                    </div>

                                                    <div>

                                                        <p className="font-medium text-gray-800">
                                                            {
                                                                mouvement.articleDesignation
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            #{mouvement.articleId}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {
                                                    mouvement.date
                                                }
                                            </td>
                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeClass(
                                                        mouvement.typeMouvement
                                                    )}`}
                                                >
                                                    {getTypeLabel(
                                                        mouvement.typeMouvement
                                                    )}
                                                </span>

                                            </td>
                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-2 text-sm">

                                                    <span className="text-gray-500">
                                                        {
                                                            mouvement.ancienneLocalisation ||
                                                            "-"
                                                        }
                                                    </span>

                                                    <ArrowRight
                                                        size={15}
                                                        className="text-gray-400"
                                                    />

                                                    <span className="font-medium text-gray-700">
                                                        {
                                                            mouvement.nouvelleLocalisation ||
                                                            "-"
                                                        }
                                                    </span>

                                                </div>

                                            </td>
                                            <td className="px-6 py-4">

                                                {mouvement.utilisateurNom ? (

                                                    <div className="flex items-center gap-2">

                                                        <User
                                                            size={16}
                                                            className="text-gray-400"
                                                        />

                                                        <span className="text-sm text-gray-700">
                                                            {
                                                                mouvement.utilisateurNom
                                                            }
                                                        </span>

                                                    </div>

                                                ) : (

                                                    <span className="text-sm text-gray-400">
                                                        -
                                                    </span>

                                                )}

                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {
                                                    mouvement.motif ||
                                                    "-"
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
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

                <div className="flex gap-3">

                    <MapPin
                        size={20}
                        className="text-blue-600 mt-0.5"
                    />

                    <div>

                        <p className="font-medium text-blue-800">
                            Périmètre du responsable
                        </p>

                        <p className="text-sm text-blue-700 mt-1">
                            Cette page affiche uniquement
                            les mouvements liés au matériel
                            rattaché à votre service ou
                            laboratoire.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}
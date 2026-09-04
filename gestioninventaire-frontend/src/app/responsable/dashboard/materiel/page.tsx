"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Package,
    Loader2,
    Eye,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/src/Services/authService";
import { getArticles } from "@/src/Services/articleService";

import { UtilisateurResponse } from "@/src/types/UtilisateurResponse";
import { ArticleResponse } from "@/src/types/ArticleResponse";

export default function ResponsableMaterielPage() {
    const router = useRouter();

    const [user, setUser] =
        useState<UtilisateurResponse | null>(null);

    const [articles, setArticles] =
        useState<ArticleResponse[]>([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [articleSelectionne, setArticleSelectionne] =
        useState<ArticleResponse | null>(null);

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

                const articlesData =
                    await getArticles();

                setArticles(articlesData);
            } catch (error) {
                console.error(
                    "Erreur chargement matériel responsable :",
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

    const articlesFiltres =
        mesArticles.filter((article) => {
            const value =
                search.toLowerCase().trim();

            if (!value) {
                return true;
            }

            return (
                article.designation
                    ?.toLowerCase()
                    .includes(value) ||
                article.numeroInventaire
                    ?.toLowerCase()
                    .includes(value) ||
                article.categorieNom
                    ?.toLowerCase()
                    .includes(value)
            );
        });

    const getEtatLabel = (
        etat?: string
    ) => {
        switch (
            String(etat)
                .toUpperCase()
        ) {
            case "DISPONIBLE":
                return "Disponible";

            case "EN_PANNE":
            case "PANNE":
                return "En panne";

            case "MAINTENANCE":
                return "Maintenance";

            case "EN_REPARATION":
                return "En réparation";

            case "HORS_SERVICE":
                return "Hors service";

            default:
                return etat || "Non renseigné";
        }
    };

    const getEtatClass = (
        etat?: string
    ) => {
        switch (
            String(etat)
                .toUpperCase()
        ) {
            case "DISPONIBLE":
                return "bg-green-100 text-green-700";

            case "EN_PANNE":
            case "PANNE":
                return "bg-red-100 text-red-700";

            case "MAINTENANCE":
            case "EN_REPARATION":
                return "bg-orange-100 text-orange-700";

            case "HORS_SERVICE":
                return "bg-gray-200 text-gray-700";

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
                    Chargement du matériel...
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">

                <div className="bg-blue-100 p-3 rounded-xl">
                    <Package
                        size={24}
                        className="text-blue-600"
                    />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Matériel
                    </h1>

                    <p className="text-sm text-gray-500">
                        Matériel rattaché à votre
                        laboratoire ou service.
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
                        placeholder="Rechercher par désignation, numéro d'inventaire ou catégorie..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm text-gray-500">
                    Total de votre matériel
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-1">
                    {articlesFiltres.length}
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-50 border-b">

                            <tr>

                                <th className="text-left px-5 py-4 font-medium text-gray-600">
                                    Matériel
                                </th>

                                <th className="text-left px-5 py-4 font-medium text-gray-600">
                                    N° inventaire
                                </th>

                                <th className="text-left px-5 py-4 font-medium text-gray-600">
                                    Catégorie
                                </th>

                                <th className="text-left px-5 py-4 font-medium text-gray-600">
                                    État
                                </th>

                                <th className="text-right px-5 py-4 font-medium text-gray-600">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {articlesFiltres.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="text-center px-6 py-12 text-gray-500"
                                    >
                                        Aucun matériel
                                        trouvé.
                                    </td>

                                </tr>

                            ) : (

                                articlesFiltres.map(
                                    (article) => (

                                        <tr
                                            key={
                                                article.id
                                            }
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4">

                                                <div className="font-medium text-gray-800">
                                                    {
                                                        article.designation
                                                    }
                                                </div>

                                            </td>

                                            <td className="px-5 py-4 text-gray-500">
                                                {
                                                    article.numeroInventaire
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-gray-500">
                                                {
                                                    article.categorieNom ||
                                                    "-"
                                                }
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getEtatClass(
                                                        article.etat
                                                    )}`}
                                                >
                                                    {getEtatLabel(
                                                        article.etat
                                                    )}
                                                </span>

                                            </td>

                                            <td className="px-5 py-4 text-right">

                                                <button
                                                    onClick={() =>
                                                        setArticleSelectionne(
                                                            article
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                                                >
                                                    <Eye
                                                        size={16}
                                                    />

                                                    Détails
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>
            {articleSelectionne && (

                <div className="fixed inset-0 z-50 flex items-center justify-center">

                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() =>
                            setArticleSelectionne(
                                null
                            )
                        }
                    />

                    <div className="relative z-10 w-[90%] max-w-2xl bg-white rounded-2xl shadow-2xl">

                        <div className="flex items-center justify-between px-6 py-5 border-b">

                            <div>

                                <h2 className="text-xl font-bold text-slate-800">
                                    Détails du matériel
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Informations du patrimoine
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setArticleSelectionne(
                                        null
                                    )
                                }
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Désignation
                                </p>

                                <p className="font-medium text-gray-800 mt-1">
                                    {
                                        articleSelectionne.designation
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    N° inventaire
                                </p>

                                <p className="font-medium text-gray-800 mt-1">
                                    {
                                        articleSelectionne.numeroInventaire
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Catégorie
                                </p>

                                <p className="font-medium text-gray-800 mt-1">
                                    {
                                        articleSelectionne.categorieNom ||
                                        "-"
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    État
                                </p>

                                <span
                                    className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${getEtatClass(
                                        articleSelectionne.etat
                                    )}`}
                                >
                                    {getEtatLabel(
                                        articleSelectionne.etat
                                    )}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Date d'acquisition
                                </p>

                                <p className="font-medium text-gray-800 mt-1">
                                    {
                                        articleSelectionne.dateAcquisition ||
                                        "-"
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Valeur
                                </p>

                                <p className="font-medium text-gray-800 mt-1">
                                    {
                                        articleSelectionne.valeur ??
                                        "-"
                                    }
                                </p>
                            </div>

                        </div>

                        <div className="px-6 py-4 border-t flex justify-end">

                            <button
                                onClick={() =>
                                    setArticleSelectionne(
                                        null
                                    )
                                }
                                className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Fermer
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}
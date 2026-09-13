"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Package,
    CheckCircle,
    AlertTriangle,
    ClipboardCheck,
    ArrowRight,
    History,
    Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/src/Services/authService";
import { getArticles } from "@/src/Services/articleService";
import { getMouvements } from "@/src/Services/MouvementService";
import { getCampagnes } from "@/src/Services/campagneService";
import { getInventairesByCampagne } from "@/src/Services/inventaireService";

import { UtilisateurResponse } from "@/src/types/UtilisateurResponse";
import { ArticleResponse } from "@/src/types/ArticleResponse";
import { MouvementResponse } from "@/src/types/MouvementResponse";
import { CampagneResponse } from "@/src/types/CampagneResponse";
import { InventaireResponse } from "@/src/types/InventaireResponse";

export default function ResponsableDashboardPage() {
    const router = useRouter();

    const [user, setUser] =
        useState<UtilisateurResponse | null>(null);

    const [articles, setArticles] =
        useState<ArticleResponse[]>([]);

    const [mouvements, setMouvements] =
        useState<MouvementResponse[]>([]);

    const [campagne, setCampagne] =
        useState<CampagneResponse | null>(null);

    const [inventaires, setInventaires] =
        useState<InventaireResponse[]>([]);

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
                    campagnesData,
                ] = await Promise.all([
                    getArticles(),
                    getMouvements(),
                    getCampagnes(),
                ]);

                setArticles(articlesData);
                setMouvements(mouvementsData);

                const campagneEnCours =
                    campagnesData.find(
                        (c) =>
                            c.statut === "EN_COURS"
                    );

                if (campagneEnCours) {
                    setCampagne(campagneEnCours);

                    const inventairesData =
                        await getInventairesByCampagne(
                            campagneEnCours.id
                        );

                    setInventaires(
                        inventairesData
                    );
                }
            } catch (error) {
                console.error(
                    "Erreur chargement dashboard responsable :",
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

    const mesMouvements = useMemo(
        () =>
            mouvements.filter(
                (mouvement) =>
                    mesArticleIds.has(
                        mouvement.articleId
                    )
            ),
        [mouvements, mesArticleIds]
    );

    const mesInventaires = useMemo(
        () =>
            inventaires.filter(
                (inventaire) =>
                    mesArticleIds.has(
                        inventaire.articleId
                    )
            ),
        [inventaires, mesArticleIds]
    );

    const totalArticles =
        mesArticles.length;

    const articlesDisponibles =
        mesArticles.filter(
            (article) =>
                String(article.etat)
                    .toUpperCase() ===
                "DISPONIBLE"
        ).length;

    const articlesProbleme =
        mesArticles.filter((article) => {
            const etat =
                String(article.etat)
                    .toUpperCase();

            return (
                etat === "EN_PANNE" ||
                etat === "PANNE" ||
                etat === "MAINTENANCE" ||
                etat === "EN_REPARATION" ||
                etat === "HORS_SERVICE"
            );
        }).length;

    const articlesInventories =
        mesInventaires.length;

    const tauxInventaire =
        totalArticles > 0
            ? Math.round(
                  (articlesInventories /
                      totalArticles) *
                      100
              )
            : 0;

    const mouvementsRecents =
        mesMouvements
            .slice()
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
            })
            .slice(0, 5);

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
                    Chargement du tableau de bord...
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Bonjour, {user?.nom}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Vue d'ensemble de votre patrimoine.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Mon matériel
                            </p>

                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {totalArticles}
                            </p>
                        </div>

                        <div className="bg-blue-100 p-3 rounded-xl">
                            <Package
                                size={24}
                                className="text-blue-600"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Disponibles
                            </p>

                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {articlesDisponibles}
                            </p>
                        </div>

                        <div className="bg-green-100 p-3 rounded-xl">
                            <CheckCircle
                                size={24}
                                className="text-green-600"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                À surveiller
                            </p>

                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {articlesProbleme}
                            </p>
                        </div>

                        <div className="bg-orange-100 p-3 rounded-xl">
                            <AlertTriangle
                                size={24}
                                className="text-orange-600"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Inventaire
                            </p>

                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {tauxInventaire}%
                            </p>
                        </div>

                        <div className="bg-purple-100 p-3 rounded-xl">
                            <ClipboardCheck
                                size={24}
                                className="text-purple-600"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

                    <div className="flex items-center justify-between mb-5">

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Inventaire annuel
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {campagne
                                    ? `Campagne ${campagne.annee}`
                                    : "Aucune campagne en cours"}
                            </p>
                        </div>

                        <ClipboardCheck
                            size={22}
                            className="text-blue-600"
                        />
                    </div>

                    {campagne ? (
                        <>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">
                                    Progression
                                </span>

                                <span className="font-semibold text-gray-700">
                                    {articlesInventories} /{" "}
                                    {totalArticles}
                                </span>
                            </div>

                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                                    style={{
                                        width: `${tauxInventaire}%`,
                                    }}
                                />
                            </div>

                            <button
                                onClick={() =>
                                    router.push(
                                        "/responsable/dashboard/inventaire"
                                    )
                                }
                                className="mt-5 flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700"
                            >
                                Voir l'inventaire
                                <ArrowRight size={16} />
                            </button>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Aucune campagne d'inventaire
                            n'est actuellement ouverte.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}
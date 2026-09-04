"use client";

import { useEffect, useState } from "react";

import {
    Search,
    CheckCircle,
    XCircle,
    ClipboardCheck,
    Loader2,
    ArrowLeft,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
    getCurrentUser
} from "@/src/Services/authService";

import {
    getCampagnes
} from "@/src/Services/campagneService";

import {
    getArticles
} from "@/src/Services/articleService";

import {
    getInventairesByCampagne,
    createInventaire
} from "@/src/Services/inventaireService";

import {
    UtilisateurResponse
} from "@/src/types/UtilisateurResponse";

import {
    CampagneResponse
} from "@/src/types/CampagneResponse";

import {
    ArticleResponse
} from "@/src/types/ArticleResponse";

import {
    InventaireResponse
} from "@/src/types/InventaireResponse";


export default function AgentInventairePage() {

    const router = useRouter();


    const [user, setUser] =
        useState<UtilisateurResponse | null>(null);


    const [campagne, setCampagne] =
        useState<CampagneResponse | null>(null);


    const [articles, setArticles] =
        useState<ArticleResponse[]>([]);


    const [inventaires, setInventaires] =
        useState<InventaireResponse[]>([]);


    const [search, setSearch] =
        useState("");


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [selectedArticle, setSelectedArticle] =
        useState<ArticleResponse | null>(null);


    const [presence, setPresence] =
        useState<"PRESENT" | "ABSENT" | "">("");


    const [commentaire, setCommentaire] =
        useState("");


    useEffect(() => {

        const fetchData = async () => {

            try {

                const currentUser =
                    await getCurrentUser();


                if (
                    currentUser.roleUtilisateur !==
                    "AGENT_INVENTAIRE"
                ) {

                    router.push("/dashboard");

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


                setCampagne(
                    campagneEnCours
                );


                const articlesData =
                    await getArticles();


                setArticles(
                    articlesData
                );


                const inventairesData =
                    await getInventairesByCampagne(
                        campagneEnCours.id
                    );


                setInventaires(
                    inventairesData
                );


            } catch (error) {

                console.error(
                    "Erreur chargement inventaire :",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchData();

    }, [router]);


    const articlesFiltres =
        articles.filter((article) => {

            const value =
                search.toLowerCase();


            return (

                article.designation
                    .toLowerCase()
                    .includes(value)

                ||

                article.numeroInventaire
                    .toLowerCase()
                    .includes(value)

            );

        });


    const isInventorie =
        (articleId: number) => {

            return inventaires.some(
                (inventaire) =>
                    inventaire.articleId ===
                    articleId
            );

        };


    const ouvrirVerification =
        (article: ArticleResponse) => {

            setSelectedArticle(
                article
            );

            setPresence("");

            setCommentaire("");

        };


    const fermerModal = () => {

        setSelectedArticle(null);

        setPresence("");

        setCommentaire("");

    };


    const handleSubmit =
        async () => {

            if (!selectedArticle) {

                return;
            }


            if (!presence) {

                alert(
                    "Veuillez sélectionner Présent ou Absent."
                );

                return;
            }


            if (!user) {

                alert(
                    "Utilisateur non identifié."
                );

                return;
            }


            if (!campagne) {

                alert(
                    "Aucune campagne en cours."
                );

                return;
            }


            try {

                setSaving(true);


                const data = {

                    dateVerification:
                        new Date()
                            .toISOString()
                            .split("T")[0],

                    statutPresence:
                        presence,

                    commentaire:
                        commentaire,

                    articleId:
                        selectedArticle.id,

                    agentId:
                        user.id,

                    campagneId:
                        campagne.id,

                };


                const nouvelInventaire =
                    await createInventaire(
                        data
                    );


                setInventaires(
                    (prev) => [
                        ...prev,
                        nouvelInventaire
                    ]
                );


                fermerModal();


            } catch (error) {

                console.error(
                    "Erreur création inventaire :",
                    error
                );


                alert(
                    "Erreur lors de l'enregistrement de l'inventaire."
                );

            } finally {

                setSaving(false);

            }

        };


    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-[400px]">

                <div className="flex items-center gap-3 text-gray-500">

                    <Loader2
                        size={22}
                        className="animate-spin"
                    />

                    Chargement...

                </div>

            </div>

        );

    }


    if (!campagne) {

        return (

            <div className="flex flex-col items-center justify-center min-h-[400px]">

                <ClipboardCheck
                    size={45}
                    className="text-gray-300 mb-4"
                />

                <h2 className="text-lg font-semibold text-gray-700">

                    Aucune campagne en cours

                </h2>


                <p className="text-sm text-gray-500 mt-1">

                    Vous ne pouvez pas effectuer
                    d'inventaire actuellement.

                </p>


                <button
                    onClick={() =>
                        router.push(
                            "/agent/dashboard"
                        )
                    }
                    className="mt-5 flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >

                    <ArrowLeft size={17} />

                    Retour

                </button>

            </div>

        );

    }


    return (

        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
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

                            Inventaire

                        </h1>


                        <p className="text-sm text-gray-500 mt-1">

                            Campagne{" "}
                            {campagne.annee}
                            {" • "}
                            {user?.nom}

                        </p>

                    </div>

                </div>


                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">

                    {inventaires.length}
                    {" / "}
                    {campagne.totalArticles}
                    {" vérifiés"}

                </div>

            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                <div className="relative">

                    <Search
                        size={19}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />


                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Rechercher par désignation ou numéro d'inventaire..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                                    N° inventaire

                                </th>


                                <th className="text-left px-5 py-3 font-medium text-gray-600">

                                    État

                                </th>


                                <th className="text-left px-5 py-3 font-medium text-gray-600">

                                    Inventaire

                                </th>


                                <th className="text-right px-5 py-3 font-medium text-gray-600">

                                    Action

                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {articlesFiltres.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="text-center py-12 text-gray-500"
                                    >

                                        Aucun article trouvé.

                                    </td>

                                </tr>

                            ) : (

                                articlesFiltres.map(
                                    (article) => {

                                        const dejaInventorie =
                                            isInventorie(
                                                article.id
                                            );


                                        const inventaire =
                                            inventaires.find(
                                                (i) =>
                                                    i.articleId ===
                                                    article.id
                                            );


                                        return (

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


                                                    <div className="text-xs text-gray-400 mt-1">

                                                        {
                                                            article.affectation
                                                        }

                                                    </div>

                                                </td>


                                                <td className="px-5 py-4 text-gray-600">

                                                    {
                                                        article.numeroInventaire
                                                    }

                                                </td>


                                                <td className="px-5 py-4">

                                                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">

                                                        {
                                                            article.etat
                                                        }

                                                    </span>

                                                </td>


                                                <td className="px-5 py-4">

                                                    {dejaInventorie ? (

                                                        inventaire?.statutPresence ===
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

                                                        )

                                                    ) : (

                                                        <span className="text-gray-400 text-xs">

                                                            Non vérifié

                                                        </span>

                                                    )}

                                                </td>


                                                <td className="px-5 py-4 text-right">

                                                    {dejaInventorie ? (

                                                        <span className="text-xs text-gray-400">

                                                            Déjà vérifié

                                                        </span>

                                                    ) : (

                                                        <button
                                                            onClick={() =>
                                                                ouvrirVerification(
                                                                    article
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                                                        >

                                                            Vérifier

                                                        </button>

                                                    )}

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {selectedArticle && (

                <div className="fixed inset-0 z-50 flex items-center justify-center">

                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={fermerModal}
                    />


                    <div className="relative z-10 bg-white w-[90%] max-w-lg rounded-2xl shadow-2xl">

                        <div className="flex items-center justify-between px-6 py-5 border-b">

                            <div>

                                <h2 className="text-lg font-bold text-gray-800">

                                    Vérification de l'article

                                </h2>


                                <p className="text-sm text-gray-500 mt-1">

                                    {
                                        selectedArticle.designation
                                    }

                                </p>

                            </div>


                            <button
                                onClick={
                                    fermerModal
                                }
                                className="text-gray-400 hover:text-gray-700 text-xl"
                            >

                                ×

                            </button>

                        </div>
                        <div className="p-6 space-y-5">

                            <div>

                                <p className="text-sm text-gray-500">

                                    N° inventaire

                                </p>


                                <p className="font-semibold text-gray-800">

                                    {
                                        selectedArticle.numeroInventaire
                                    }

                                </p>

                            </div>


                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-3">

                                    Présence de l'article

                                </label>


                                <div className="grid grid-cols-2 gap-3">


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPresence(
                                                "PRESENT"
                                            )
                                        }
                                        className={
                                            presence ===
                                            "PRESENT"
                                                ? "border-2 border-green-500 bg-green-50 text-green-700 rounded-xl p-4"
                                                : "border border-gray-200 hover:border-green-300 rounded-xl p-4"
                                        }
                                    >

                                        <CheckCircle
                                            size={24}
                                            className="mx-auto mb-2"
                                        />


                                        <span className="font-medium">

                                            Présent

                                        </span>

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPresence(
                                                "ABSENT"
                                            )
                                        }
                                        className={
                                            presence ===
                                            "ABSENT"
                                                ? "border-2 border-red-500 bg-red-50 text-red-700 rounded-xl p-4"
                                                : "border border-gray-200 hover:border-red-300 rounded-xl p-4"
                                        }
                                    >

                                        <XCircle
                                            size={24}
                                            className="mx-auto mb-2"
                                        />


                                        <span className="font-medium">

                                            Absent

                                        </span>

                                    </button>

                                </div>

                            </div>


                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">

                                    Commentaire
                                    {" "}
                                    <span className="text-gray-400 font-normal">

                                        (facultatif)

                                    </span>

                                </label>


                                <textarea
                                    value={
                                        commentaire
                                    }
                                    onChange={(e) =>
                                        setCommentaire(
                                            e.target.value
                                        )
                                    }
                                    rows={4}
                                    placeholder="Ajouter un commentaire..."
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />

                            </div>

                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">

                            <button
                                type="button"
                                onClick={
                                    fermerModal
                                }
                                disabled={saving}
                                className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                            >

                                Annuler

                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleSubmit
                                }
                                disabled={
                                    saving ||
                                    !presence
                                }
                                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center gap-2"
                            >

                                {saving ? (

                                    <>

                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                        Enregistrement...

                                    </>

                                ) : (

                                    "Enregistrer"

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}
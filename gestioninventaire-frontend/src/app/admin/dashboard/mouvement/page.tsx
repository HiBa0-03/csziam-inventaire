"use client";

import { useEffect, useState } from "react";

import {
ArrowRight,
History,
MapPin,
Package,
Search,
MoveRight
} from "lucide-react";

import {
getMouvements,
createMouvement
} from "@/src/Services/MouvementService";

import {
getArticles
} from "@/src/Services/articleService";

import {
getServices
} from "@/src/Services/serviceOrganisationnelService";

import {
getLaboratoires
} from "@/src/Services/laboratoireService";

import {
getUtilisateurs
} from "@/src/Services/utilisateurService";

import { MouvementResponse } from "@/src/types/MouvementResponse";
import { ArticleResponse } from "@/src/types/ArticleResponse";
import { ServiceResponse } from "@/src/types/ServiceResponse";
import { LaboratoireResponse } from "@/src/types/LaboratoireResponse";
import { MouvementRequest } from "@/src/types/MouvementRequest";
import { UtilisateurResponse } from "@/src/types/UtilisateurResponse";

export default function MouvementsPage() {

const [articles, setArticles] =
    useState<ArticleResponse[]>([]);

const [mouvements, setMouvements] =
    useState<MouvementResponse[]>([]);

const [services, setServices] =
    useState<ServiceResponse[]>([]);

const [laboratoires, setLaboratoires] =
    useState<LaboratoireResponse[]>([]);

const [utilisateurs, setUtilisateurs] =
    useState<UtilisateurResponse[]>([]);

const [articleSelectionne, setArticleSelectionne] =
    useState<ArticleResponse | null>(null);

const [typeEmplacement, setTypeEmplacement] =
    useState<"service" | "laboratoire">("service");

const [search, setSearch] =
    useState("");

const [loading, setLoading] =
    useState(true);

const [loadingMouvement, setLoadingMouvement] =
    useState(false);

const [form, setForm] = useState({
    typeMouvement: "TRANSFERT",
    date: new Date().toISOString().split("T")[0],
    motif: "",
    nouvelleLocalisation: "",
    serviceId: undefined as number | undefined,
    laboratoireId: undefined as number | undefined,
    utilisateurId: undefined as number | undefined,
    dureePret: 1
});

const ARTICLES_PAR_PAGE = 3;

const [page, setPage] = useState(1);

const loadData = async () => {

    try {

        setLoading(true);

        const [
            articlesData,
            mouvementsData,
            servicesData,
            laboratoiresData,
            utilisateursData
        ] = await Promise.all([
            getArticles(),
            getMouvements(),
            getServices(),
            getLaboratoires(),
            getUtilisateurs()
        ]);

        setArticles(articlesData);
        setMouvements(mouvementsData);
        setServices(servicesData);
        setLaboratoires(laboratoiresData);
        setUtilisateurs(utilisateursData);

    } catch (error) {

        console.error(
            "Erreur lors du chargement des données :",
            error
        );

        alert(
            "Impossible de charger les données."
        );

    } finally {

        setLoading(false);

    }

};


useEffect(() => {

    loadData();

}, []);

const articlesFiltres =
    articles.filter(article => {

        const recherche =
            search.toLowerCase();

        return (
            article.designation
                ?.toLowerCase()
                .includes(recherche)
            ||
            article.numeroInventaire
                ?.toLowerCase()
                .includes(recherche)
        );

    });


const totalPages =
    Math.ceil(
        articlesFiltres.length /
        ARTICLES_PAR_PAGE
    );


const indexDebut =
    (page - 1) *
    ARTICLES_PAR_PAGE;


const articlesPagines =
    articlesFiltres.slice(
        indexDebut,
        indexDebut + ARTICLES_PAR_PAGE
    );
const getDernierMouvement = (
    articleId: number
): MouvementResponse | undefined => {

    return mouvements
        .filter(
            mouvement =>
                mouvement.articleId === articleId
        )
        .sort((a, b) => {

            const dateA =
                new Date(a.date).getTime();

            const dateB =
                new Date(b.date).getTime();

            if (dateA !== dateB) {

                return dateB - dateA;

            }

            return (
                (b.id ?? 0) -
                (a.id ?? 0)
            );

        })[0];

};
const selectionnerArticle = (
    article: ArticleResponse
) => {

    setArticleSelectionne(article);

    setForm(prev => ({
        ...prev,
        nouvelleLocalisation: "",
        serviceId: undefined,
        laboratoireId: undefined,
        utilisateurId: undefined,
        dureePret: 1
    }));

};
const getAncienneLocalisation = (): string => {

    if (!articleSelectionne) {

        return "";

    }

    return (
        articleSelectionne.affectation ||
        "Emplacement non renseigné"
    );

};

const handleChange = (
    e: React.ChangeEvent<
        HTMLInputElement |
        HTMLSelectElement
    >
) => {

    const {
        name,
        value
    } = e.target;

    setForm(prev => ({
        ...prev,
        [name]:
            name === "serviceId" ||
            name === "laboratoireId" ||
            name === "utilisateurId" ||
            name === "dureePret"
                ? Number(value)
                : value
    }));

};
const changerTypeEmplacement = (
    type: "service" | "laboratoire"
) => {

    setTypeEmplacement(type);

    setForm(prev => ({
        ...prev,
        nouvelleLocalisation: "",
        serviceId: undefined,
        laboratoireId: undefined
    }));

};

const getTypeClass = (
    type: string
) => {

    switch (type) {

        case "AFFECTATION":
            return "bg-purple-100 text-purple-700";

        case "TRANSFERT":
            return "bg-blue-100 text-blue-700";

        case "PRET":
            return "bg-orange-100 text-orange-700";

        case "RETOUR":
            return "bg-green-100 text-green-700";

        case "REPARATION":
            return "bg-red-100 text-red-700";

        case "MAINTENANCE":
            return "bg-yellow-100 text-yellow-700";

        case "SORTIE_DEFINITIVE":
            return "bg-gray-200 text-gray-700";

        default:
            return "bg-gray-100 text-gray-700";

    }

};
const getEtatArticle = (): string => {

    if (!articleSelectionne) {

        return "";

    }

    return String(
        articleSelectionne.etat || ""
    ).toUpperCase();

};

const articleBloque = (): boolean => {

    const etat =
        getEtatArticle();

    return (
        etat === "EN_PANNE" ||
        etat === "PANNE" ||
        etat === "MAINTENANCE" ||
        etat === "EN_REPARATION" ||
        etat === "HORS_SERVICE"
    );

};

const mouvementInterdit = (): boolean => {

    if (!articleSelectionne) {

        return false;

    }

    const etat =
        getEtatArticle();

    const type =
        form.typeMouvement;

    if (
        etat === "EN_PANNE" ||
        etat === "PANNE"
    ) {

        return (
            type === "AFFECTATION" ||
            type === "PRET" ||
            type === "TRANSFERT"
        );

    }

    if (
        etat === "MAINTENANCE" ||
        etat === "EN_REPARATION"
    ) {

        return (
            type === "AFFECTATION" ||
            type === "PRET" ||
            type === "TRANSFERT"
        );

    }

    if (
        etat === "HORS_SERVICE"
    ) {

        return (
            type !== "SORTIE_DEFINITIVE"
        );

    }

    return false;

};

const getMessageEtat = (): string => {

    if (!articleSelectionne) {

        return "";

    }

    const etat =
        getEtatArticle();

    if (
        etat === "EN_PANNE" ||
        etat === "PANNE"
    ) {

        return "Cet article est en panne. Il ne peut pas être affecté, prêté ou transféré.";

    }

    if (
        etat === "MAINTENANCE"
    ) {

        return "Cet article est actuellement en maintenance. Il ne peut pas être affecté, prêté ou transféré.";

    }

    if (
        etat === "EN_REPARATION"
    ) {

        return "Cet article est actuellement en réparation. Il ne peut pas être affecté, prêté ou transféré.";

    }

    if (
        etat === "HORS_SERVICE"
    ) {

        return "Cet article est hors service. Seule une sortie définitive peut être effectuée.";

    }

    return "";

};

const getResponsablesService = (
    serviceId?: number
): UtilisateurResponse[] => {

    if (!serviceId) {

        return [];

    }

    return utilisateurs.filter(
        utilisateur =>
            utilisateur.roleUtilisateur === "RESPONSABLE" &&
            utilisateur.serviceId === serviceId
    );

};

const getResponsablesLaboratoire = (
    laboratoireId?: number
): UtilisateurResponse[] => {

    if (!laboratoireId) {

        return [];

    }

    return utilisateurs.filter(
        utilisateur =>
            utilisateur.roleUtilisateur === "RESPONSABLE" &&
            utilisateur.laboratoireId === laboratoireId
    );

};

const getResponsablesMouvement = (
    mouvement: MouvementResponse
): UtilisateurResponse[] => {

    const responsablesService =
        getResponsablesService(
            mouvement.serviceId
        );

    const responsablesLabo =
        getResponsablesLaboratoire(
            mouvement.laboratoireId
        );

    return [
        ...responsablesService,
        ...responsablesLabo
    ];

};

const handleSubmit = async (
    e: React.FormEvent
) => {

    e.preventDefault();

    if (!articleSelectionne) {

        alert(
            "Veuillez sélectionner un article."
        );

        return;

    }

    if (!form.typeMouvement) {

        alert(
            "Veuillez sélectionner un type de mouvement."
        );

        return;

    }

    if (!form.motif.trim()) {

        alert(
            "Veuillez renseigner le motif."
        );

        return;

    }

    if (mouvementInterdit()) {

        alert(
            getMessageEtat()
        );

        return;

    }

    if (
        form.typeMouvement === "AFFECTATION" ||
        form.typeMouvement === "PRET"
    ) {

        if (!form.utilisateurId) {

            alert(
                "Veuillez sélectionner un utilisateur."
            );

            return;

        }

    }

    if (
        form.typeMouvement === "TRANSFERT" ||
        form.typeMouvement === "PRET"
    ) {

        if (
            !form.serviceId &&
            !form.laboratoireId
        ) {

            alert(
                "Veuillez sélectionner un service ou un laboratoire."
            );

            return;

        }

    }

    try {

        setLoadingMouvement(true);

        const mouvement: MouvementRequest = {

            date:
                form.date,

            typeMouvement:
                form.typeMouvement,

            motif:
                form.motif,

            articleId:
                articleSelectionne.id,

            serviceId:
                (
                    form.typeMouvement === "TRANSFERT" ||
                    form.typeMouvement === "PRET"
                )
                    ? form.serviceId
                    : undefined,

            laboratoireId:
                (
                    form.typeMouvement === "TRANSFERT" ||
                    form.typeMouvement === "PRET"
                )
                    ? form.laboratoireId
                    : undefined,

            utilisateurId:
                (
                    form.typeMouvement === "AFFECTATION" ||
                    form.typeMouvement === "PRET"
                )
                    ? form.utilisateurId
                    : undefined

        };

        console.log(
            "Mouvement envoyé :",
            mouvement
        );

        await createMouvement(
            mouvement
        );

        alert(
            "Mouvement enregistré avec succès."
        );

        setForm({

            typeMouvement:
                "TRANSFERT",

            date:
                new Date()
                    .toISOString()
                    .split("T")[0],

            motif: "",

            nouvelleLocalisation: "",

            serviceId:
                undefined,

            laboratoireId:
                undefined,

            utilisateurId:
                undefined,

            dureePret: 1

        });

        setArticleSelectionne(null);

        await loadData();

    } catch (error: any) {

        console.error(
            "Erreur lors de l'enregistrement du mouvement :",
            error
        );

        if (
            error?.response?.status === 403
        ) {

            alert(
                error?.response?.data?.message ||
                "Action impossible : cet article ne peut pas effectuer ce mouvement dans son état actuel."
            );

        } else if (
            error?.response?.status === 400
        ) {

            alert(
                error?.response?.data?.message ||
                "Mouvement impossible : les données saisies sont invalides."
            );

        } else if (
            error?.response?.status === 404
        ) {

            alert(
                error?.response?.data?.message ||
                "Article, utilisateur ou emplacement introuvable."
            );

        } else {

            alert(
                "Erreur lors de l'enregistrement du mouvement."
            );

        }

    } finally {

        setLoadingMouvement(false);

    }

};

if (loading) {

    return (

        <div className="w-full min-w-0 p-6">

            <div className="bg-white border rounded-xl p-8 text-center text-gray-500">

                Chargement des mouvements...

            </div>

        </div>

    );

}


return (

    <div className="w-full min-w-0 max-w-full p-6 space-y-6 overflow-x-hidden">

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

                    Gestion des déplacements des articles

                </p>

            </div>

        </div>
        <div className="w-full min-w-0 bg-white rounded-xl border shadow-sm p-5">

            <div className="flex items-center justify-between mb-4 gap-4">

                <div>

                    <h2 className="text-lg font-semibold text-gray-800">

                        Articles

                    </h2>

                    <p className="text-sm text-gray-500">

                        Sélectionnez un article pour effectuer
                        un mouvement.

                    </p>

                </div>


                <div className="relative shrink-0">

                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => {

                            setSearch(
                                e.target.value
                            );

                            setPage(1);

                        }}
                        className="pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

                {articlesPagines.map(article => {

                    const selected =
                        articleSelectionne?.id ===
                        article.id;

                    return (

                        <button
                            key={article.id}
                            type="button"
                            onClick={() =>
                                selectionnerArticle(
                                    article
                                )
                            }
                            className={`
                                text-left border rounded-xl p-4
                                transition
                                ${
                                    selected
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                }
                            `}
                        >

                            <div className="flex items-start gap-3">

                                <div className="bg-gray-100 p-2 rounded-lg">

                                    <Package
                                        size={19}
                                        className="text-gray-600"
                                    />

                                </div>

                                <div className="flex-1 min-w-0">

                                    <p className="font-medium text-gray-800 truncate">

                                        {article.designation}

                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">

                                        {article.numeroInventaire}

                                    </p>

                                    <p className="text-xs text-gray-500 mt-2 truncate">

                                        <MapPin
                                            size={13}
                                            className="inline mr-1"
                                        />

                                        {article.affectation ||
                                            "Emplacement non renseigné"}

                                    </p>

                                </div>

                                <MoveRight
                                    size={18}
                                    className="text-gray-400 shrink-0"
                                />

                            </div>

                        </button>

                    );

                })}

            </div>


            {totalPages > 1 && (

                <div className="flex items-center justify-between mt-5 pt-4 border-t">

                    <p className="text-sm text-gray-500">

                        {indexDebut + 1}–

                        {Math.min(
                            indexDebut +
                            ARTICLES_PAR_PAGE,
                            articlesFiltres.length
                        )}

                        {" "}
                        sur {articlesFiltres.length} articles

                    </p>


                    <div className="flex items-center gap-2">

                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() =>
                                setPage(
                                    prev =>
                                        prev - 1
                                )
                            }
                            className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            ←
                        </button>


                        <button
                            type="button"
                            disabled={
                                page === totalPages
                            }
                            onClick={() =>
                                setPage(
                                    prev =>
                                        prev + 1
                                )
                            }
                            className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            →
                        </button>

                    </div>

                </div>

            )}

        </div>
        {articleSelectionne && (

            <div className="w-full min-w-0 bg-white rounded-xl border shadow-sm p-6">

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-blue-100 p-3 rounded-xl">

                        <MoveRight
                            size={22}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-lg font-semibold text-gray-800">

                            Nouveau mouvement

                        </h2>

                        <p className="text-sm text-gray-500">

                            {articleSelectionne.designation}

                        </p>

                    </div>

                </div>

                <div className="mb-5">

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Ancienne localisation

                    </label>

                    <div className="bg-gray-50 border rounded-lg px-4 py-3 text-gray-600">

                        <MapPin
                            size={16}
                            className="inline mr-2"
                        />

                        {getAncienneLocalisation()}

                    </div>

                </div>

                {articleBloque() && (

                    <div className="mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">

                        <p className="text-sm text-red-700 font-medium">

                            Action limitée

                        </p>

                        <p className="text-xs text-red-600 mt-1">

                            {getMessageEtat()}

                        </p>

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                            <label className="block text-sm font-medium mb-2">

                                Type de mouvement

                            </label>

                            <select
                                name="typeMouvement"
                                value={
                                    form.typeMouvement
                                }
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2.5"
                            >

                                <option value="">

                                    Sélectionner un type

                                </option>

                                <option value="AFFECTATION">

                                    Affectation

                                </option>

                                <option value="TRANSFERT">

                                    Transfert

                                </option>

                                <option value="PRET">

                                    Prêt

                                </option>

                                <option value="RETOUR">

                                    Retour

                                </option>

                                <option value="REPARATION">

                                    Réparation

                                </option>

                                <option value="MAINTENANCE">

                                    Maintenance

                                </option>

                                <option value="SORTIE_DEFINITIVE">

                                    Sortie définitive

                                </option>

                            </select>

                        </div>


                        <div>

                            <label className="block text-sm font-medium mb-2">

                                Date

                            </label>

                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-2.5"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">

                            Motif

                        </label>

                        <input
                            type="text"
                            name="motif"
                            value={form.motif}
                            onChange={handleChange}
                            placeholder="Ex : Réorganisation du laboratoire"
                            required
                            className="w-full border rounded-lg px-4 py-2.5"
                        />

                    </div>

                    {
                        (
                            form.typeMouvement ===
                                "AFFECTATION"
                            ||
                            form.typeMouvement ===
                                "PRET"
                        )
                        && (

                            <div>

                                <label className="block text-sm font-medium mb-2">

                                    Utilisateur

                                </label>

                                <select
                                    name="utilisateurId"
                                    value={
                                        form.utilisateurId ??
                                        ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="w-full border rounded-lg px-4 py-2.5"
                                >

                                    <option value="">

                                        Sélectionner un utilisateur

                                    </option>

                                    {utilisateurs
                                        .filter(
                                            utilisateur =>
                                                utilisateur.roleUtilisateur !== "ADMIN"
                                        )
                                        .map(
                                            utilisateur => (

                                                <option
                                                    key={
                                                        utilisateur.id
                                                    }
                                                    value={
                                                        utilisateur.id
                                                    }
                                                >

                                                    {
                                                        utilisateur.nom
                                                    }

                                                    {utilisateur.email
                                                        ? ` — ${utilisateur.email}`
                                                        : ""
                                                    }

                                                </option>

                                            )
                                        )}

                                </select>

                            </div>

                        )
                    }

                    {
                        form.typeMouvement ===
                            "PRET"
                        && (

                            <div>

                                <label className="block text-sm font-medium mb-2">

                                    Durée du prêt

                                </label>

                                <div className="flex items-center gap-3">

                                    <input
                                        type="number"
                                        name="dureePret"
                                        min="1"
                                        value={
                                            form.dureePret
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full border rounded-lg px-4 py-2.5"
                                    />

                                    <span className="text-sm text-gray-500 whitespace-nowrap">

                                        jours

                                    </span>

                                </div>

                                <p className="text-xs text-gray-400 mt-1">

                                    Cette durée est actuellement
                                    utilisée uniquement dans le formulaire.

                                </p>

                            </div>

                        )
                    }

                    {
                        (
                            form.typeMouvement ===
                                "TRANSFERT"
                            ||
                            form.typeMouvement ===
                                "PRET"
                        )
                        && (

                            <div>

                                <label className="block text-sm font-medium mb-3">

                                    Nouvelle localisation

                                </label>


                                <div className="flex gap-6 mb-4">

                                    <label className="flex items-center gap-2">

                                        <input
                                            type="radio"
                                            checked={
                                                typeEmplacement ===
                                                "service"
                                            }
                                            onChange={() =>
                                                changerTypeEmplacement(
                                                    "service"
                                                )
                                            }
                                        />

                                        Service

                                    </label>


                                    <label className="flex items-center gap-2">

                                        <input
                                            type="radio"
                                            checked={
                                                typeEmplacement ===
                                                "laboratoire"
                                            }
                                            onChange={() =>
                                                changerTypeEmplacement(
                                                    "laboratoire"
                                                )
                                            }
                                        />

                                        Laboratoire

                                    </label>

                                </div>


                                {
                                    typeEmplacement ===
                                        "service"
                                    && (

                                        <select
                                            name="serviceId"
                                            value={
                                                form.serviceId ??
                                                ""
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            className="w-full border rounded-lg px-4 py-2.5"
                                        >

                                            <option value="">

                                                Sélectionner un service

                                            </option>

                                            {services.map(
                                                service => (

                                                    <option
                                                        key={
                                                            service.id
                                                        }
                                                        value={
                                                            service.id
                                                        }
                                                    >

                                                        {
                                                            service.nom
                                                        }

                                                    </option>

                                                )
                                            )}

                                        </select>

                                    )
                                }


                                {
                                    typeEmplacement ===
                                        "laboratoire"
                                    && (

                                        <select
                                            name="laboratoireId"
                                            value={
                                                form.laboratoireId ??
                                                ""
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            className="w-full border rounded-lg px-4 py-2.5"
                                        >

                                            <option value="">

                                                Sélectionner un laboratoire

                                            </option>

                                            {laboratoires.map(
                                                laboratoire => (

                                                    <option
                                                        key={
                                                            laboratoire.id
                                                        }
                                                        value={
                                                            laboratoire.id
                                                        }
                                                    >

                                                        {
                                                            laboratoire.nom
                                                        }

                                                    </option>

                                                )
                                            )}

                                        </select>

                                    )
                                }

                            </div>

                        )
                    }


                    {
                        form.typeMouvement ===
                            "SORTIE_DEFINITIVE"
                        && (

                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">

                                <p className="text-sm text-red-700 font-medium">

                                    ⚠️ Sortie définitive

                                </p>

                                <p className="text-xs text-red-600 mt-1">

                                    Cet article sera retiré de la
                                    liste des articles après
                                    l'enregistrement.

                                </p>

                            </div>

                        )
                    }

                    {
                        form.typeMouvement ===
                            "REPARATION"
                        && (

                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">

                                <p className="text-sm text-red-700 font-medium">

                                    État après mouvement :
                                    {" "}
                                    En panne

                                </p>

                            </div>

                        )
                    }

                    {
                        form.typeMouvement ===
                            "MAINTENANCE"
                        && (

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">

                                <p className="text-sm text-yellow-700 font-medium">

                                    État après mouvement :
                                    {" "}
                                    Maintenance

                                </p>

                            </div>

                        )
                    }
                    <div className="flex justify-end gap-3 pt-4 border-t">

                        <button
                            type="button"
                            onClick={() =>
                                setArticleSelectionne(
                                    null
                                )
                            }
                            className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50"
                        >

                            Annuler

                        </button>


                        <button
                            type="submit"
                            disabled={
                                loadingMouvement ||
                                mouvementInterdit()
                            }
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                            {
                                loadingMouvement
                                    ? "Enregistrement..."
                                    : "Enregistrer le mouvement"
                            }

                        </button>

                    </div>

                </form>

            </div>

        )}

        <div className="w-full min-w-0 bg-white rounded-xl border shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b">

                <h2 className="text-lg font-semibold text-gray-800">

                    Historique des mouvements

                </h2>

                <p className="text-sm text-gray-500">

                    Tous les mouvements enregistrés.

                </p>

            </div>


            <div className="w-full max-w-full overflow-x-auto">

                <table className="w-full min-w-[1100px]">

                    <thead>

                        <tr className="bg-gray-50 border-b">

                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                Article

                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                Date

                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                Type

                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                Ancienne localisation

                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                Nouvelle localisation

                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                Responsable(s)

                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                Utilisateur

                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">

                                Motif

                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            mouvements.length === 0

                                ? (

                                    <tr>

                                        <td
                                            colSpan={8}
                                            className="text-center px-6 py-10 text-gray-500"
                                        >

                                            Aucun mouvement enregistré.

                                        </td>

                                    </tr>

                                )

                                : (

                                    mouvements
                                        .slice()
                                        .sort(
                                            (a, b) => {

                                                const dateA =
                                                    new Date(
                                                        a.date
                                                    ).getTime();

                                                const dateB =
                                                    new Date(
                                                        b.date
                                                    ).getTime();

                                                if (
                                                    dateA !==
                                                    dateB
                                                ) {

                                                    return (
                                                        dateB -
                                                        dateA
                                                    );

                                                }

                                                return (
                                                    (b.id ?? 0) -
                                                    (a.id ?? 0)
                                                );

                                            }
                                        )
                                        .map(
                                            mouvement => {

                                                const responsables =
                                                    getResponsablesMouvement(
                                                        mouvement
                                                    );

                                                return (

                                                    <tr
                                                        key={
                                                            mouvement.id
                                                        }
                                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4">

                                                            <div className="flex items-center gap-2">

                                                                <Package
                                                                    size={17}
                                                                    className="text-gray-500"
                                                                />

                                                                <div>

                                                                    <p className="font-medium text-gray-800">

                                                                        {
                                                                            mouvement.articleDesignation
                                                                                ||
                                                                            `Article #${mouvement.articleId}`
                                                                        }

                                                                    </p>

                                                                    <p className="text-xs text-gray-400">

                                                                        ID :
                                                                        {" "}
                                                                        {
                                                                            mouvement.articleId
                                                                        }

                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </td>

                                                        <td className="px-6 py-4 text-sm text-gray-600">

                                                            {
                                                                new Date(
                                                                    mouvement.date
                                                                ).toLocaleDateString(
                                                                    "fr-FR"
                                                                )
                                                            }

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <span
                                                                className={`
                                                                    px-3 py-1
                                                                    rounded-full
                                                                    text-xs
                                                                    font-medium
                                                                    ${getTypeClass(
                                                                        mouvement.typeMouvement
                                                                    )}
                                                                `}
                                                            >

                                                                {
                                                                    mouvement.typeMouvement
                                                                }

                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-4 text-sm text-gray-600">

                                                            {
                                                                mouvement.ancienneLocalisation
                                                            }

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <div className="flex items-center gap-2 text-sm text-gray-800">

                                                                <ArrowRight
                                                                    size={16}
                                                                    className="text-blue-500"
                                                                />

                                                                {
                                                                    mouvement.nouvelleLocalisation
                                                                }

                                                            </div>

                                                        </td>

                                                        <td className="px-6 py-4 text-sm">

                                                            {
                                                                responsables.length > 0

                                                                    ? (

                                                                        <div className="space-y-1">

                                                                            {
                                                                                responsables.map(
                                                                                    responsable => (

                                                                                        <p
                                                                                            key={
                                                                                                responsable.id
                                                                                            }
                                                                                            className="font-medium text-gray-800"
                                                                                        >

                                                                                            {
                                                                                                responsable.nom
                                                                                            }

                                                                                        </p>

                                                                                    )
                                                                                )
                                                                            }

                                                                        </div>

                                                                    )

                                                                    : (

                                                                        <span className="text-gray-400">
                                                                            —
                                                                        </span>

                                                                    )
                                                            }

                                                        </td>

                                                        <td className="px-6 py-4 text-sm">

                                                            {
                                                                mouvement.utilisateurNom

                                                                    ? (

                                                                        <div>

                                                                            <p className="font-medium text-gray-800">

                                                                                {
                                                                                    mouvement.utilisateurNom
                                                                                }

                                                                            </p>

                                                                            {
                                                                                (
                                                                                    mouvement.typeMouvement ===
                                                                                        "AFFECTATION"
                                                                                    ||
                                                                                    mouvement.typeMouvement ===
                                                                                        "PRET"
                                                                                )
                                                                                && (

                                                                                    <p className="text-xs text-gray-400">

                                                                                        {
                                                                                            mouvement.typeMouvement ===
                                                                                                "PRET"
                                                                                                ? "Bénéficiaire du prêt"
                                                                                                : "Personne affectée"
                                                                                        }

                                                                                    </p>

                                                                                )
                                                                            }

                                                                        </div>

                                                                    )

                                                                    : (

                                                                        <span className="text-gray-400">

                                                                            —

                                                                        </span>

                                                                    )
                                                            }

                                                        </td>


                                                        {/* MOTIF */}

                                                        <td className="px-6 py-4 text-sm text-gray-600">

                                                            {
                                                                mouvement.motif
                                                                    ||
                                                                "—"
                                                            }

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )

                                )
                        }

                    </tbody>

                </table>

            </div>

        </div>

    </div>

);

}

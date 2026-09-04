"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    Calendar,
    ClipboardCheck,
    CheckCircle,
    XCircle,
    User,
} from "lucide-react";

import {getCampagneById,} from "@/src/Services/campagneService";

import {getInventairesByCampagne,} from "@/src/Services/inventaireService";

import { CampagneResponse } from "@/src/types/CampagneResponse";
import { InventaireResponse } from "@/src/types/InventaireResponse";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function CampagneDetailPage() {

    const params = useParams();

    const id = Number(params.id);

    const [campagne, setCampagne] =
        useState<CampagneResponse | null>(null);

    const [inventaires, setInventaires] =
        useState<InventaireResponse[]>([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchData = async () => {

            try {

                const campagneData =
                    await getCampagneById(id);

                const inventairesData =
                    await getInventairesByCampagne(id);

                setCampagne(campagneData);

                setInventaires(inventairesData);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, [id]);


    if (loading) {

        return (

            <div className="flex items-center justify-center py-20">

                <p className="text-gray-500">
                    Chargement...
                </p>

            </div>

        );

    }

    if (!campagne) {
   

        return (

            <div className="flex flex-col items-center justify-center py-20">

                <p className="text-gray-500 mb-4">
                    Campagne introuvable.
                </p>

                <Link
                    href="/admin/dashboard/campaigns"
                    className="text-blue-600 hover:underline"
                >
                    Retour aux campagnes
                </Link>
               
            </div>

        );

    }



    const presents = inventaires.filter(
        (inventaire) =>
            inventaire.statutPresence === "PRESENT"
    ).length;


    const absents = inventaires.filter(
        (inventaire) =>
            inventaire.statutPresence === "ABSENT"
    ).length;

     const handleExport = () => {

    if (!inventaires || inventaires.length === 0) {
        alert("Aucun inventaire à exporter.");
        return;
    }

    const data = inventaires.map((inventaire) => ({
        Article: inventaire.articleDesignation,
        Agent: inventaire.agentNom,
        "Date de vérification": inventaire.dateVerification,
        Présence: inventaire.statutPresence,
        Commentaire: inventaire.commentaire || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Inventaire"
    );

    XLSX.writeFile(
        workbook,
        `Inventaire_Campagne_${campagne.annee}.xlsx`
    );
};
    
    return (

        <div className="flex flex-col gap-6">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <Link
                        href="/admin/dashboard/campaigns"
                        className="text-gray-600 hover:text-gray-900">
                        <ChevronLeft size={24} />
                    </Link>

                    <div>

                        <h1 className="text-2xl font-bold text-gray-800">
                            Campagne {campagne.annee}
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Détails de la campagne d'inventaire
                        </p>

                    </div>

                </div>

                <button
                    onClick={handleExport}
                    disabled={inventaires.length === 0}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <Download size={17} />
                    Exporter
                </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                    <div className="flex items-center gap-3">

                        <div className="bg-blue-100 rounded-full p-2.5">
                            <Calendar size={20} className="text-blue-700"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Année
                            </p>
                            <p className="text-xl font-bold text-gray-800">
                                {campagne.annee}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                    <div className="flex items-center gap-3">

                        <div className="bg-purple-100 rounded-full p-2.5">

                            <Calendar size={20} className="text-purple-700"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Période
                            </p>

                            <p className="text-sm font-semibold text-gray-800">
                                {campagne.dateDebut}
                                {" → "}
                                {campagne.dateFin}

                            </p>

                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3">

                        <div className={campagne.statut === "EN_COURS"
                                    ? "bg-green-100 rounded-full p-2.5"
                                    : "bg-blue-100 rounded-full p-2.5"
                            }>

                            <ClipboardCheck size={20}
                                className={campagne.statut === "EN_COURS"
                                        ? "text-green-700"
                                        : "text-blue-700"
                                }/>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Statut
                            </p>

                            <p className="text-lg font-bold text-gray-800">
                                {campagne.statut === "EN_COURS"
                                    ? "En cours"
                                    : "Terminée"
                                }

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                <div className="flex justify-between items-center mb-3">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">

                            Progression de l'inventaire
                        </h2>


                        <p className="text-sm text-gray-500 mt-1">
                            {campagne.articlesInventories}
                            {" article(s) inventorié(s) sur "}
                            {campagne.totalArticles}

                        </p>

                    </div>


                    <span className="text-lg font-bold text-blue-600">
                        {campagne.progression}%
                    </span>

                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{width: `${campagne.progression}%`
                        }}/>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                    <div className="flex items-center gap-3">

                        <div className="bg-blue-100 rounded-full p-2.5">

                            <ClipboardCheck size={20} className="text-blue-700"  />

                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Articles inventoriés
                            </p>

                            <p className="text-2xl font-bold text-gray-800">
                                {campagne.articlesInventories}

                            </p>

                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3">

                        <div className="bg-green-100 rounded-full p-2.5">

                            <CheckCircle
                                size={20}
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

                        <div className="bg-red-100 rounded-full p-2.5">

                            <XCircle size={20} className="text-red-700"/>

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

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">

                <div className="p-5 border-b border-gray-100">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Vérifications effectuées
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Liste des articles vérifiés pendant cette campagne.
                            </p>

                        </div>
                        <span className="text-sm text-gray-500">
                            {inventaires.length} vérification(s)
                        </span>
                    </div>

                </div>

                <div className="overflow-x-auto">
                    {inventaires.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-sm text-gray-500">
                                Aucun article n'a encore été inventorié.

                            </p>

                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">
                                        Article
                                    </th>

                                    <th className="text-left px-5 py-3 font-medium text-gray-600">
                                        Agent
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
                                {inventaires.map((inventaire) => (
                                    <tr key={inventaire.id} className="hover:bg-gray-50">

                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-800">
                                                {inventaire.articleDesignation ||`Article #${inventaire.articleId}`}
                                            </div>

                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <User
                                                    size={16}
                                                    className="text-gray-400" />
                                                <span>
                                                    {inventaire.agentNom ||`Agent #${inventaire.agentId}`}
                                                </span>

                                            </div>

                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {inventaire.dateVerification}
                                        </td>
                                        <td className="px-5 py-4">
                                            {inventaire.statutPresence === "PRESENT" ? (

                                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">

                                                    <CheckCircle size={14} />
                                                    Présent
                                                </span>

                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                                    <XCircle size={14} />
                                                    Absent
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {inventaire.commentaire ||"Aucun commentaire." }
                                        </td>
                                    </tr>
                                ))}

                            </tbody>

                        </table>
                    )}

                </div>
            </div>

        </div>

    );

}
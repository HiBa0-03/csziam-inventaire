"use client";

import { useState } from "react";
import {
    FileText,
    Download,
    Sparkles,
    Loader2,
} from "lucide-react";

import {
    genererRapport,
    telechargerRapportPdf,
} from "@/src/Services/rapportService";

export default function ReportsPage() {

    const [rapport, setRapport] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleGenererRapport = async () => {

        try {

            setLoading(true);
            setError("");
            setRapport("");

            const resultat = await genererRapport();

            setRapport(resultat);

        } catch (error) {

            console.error(error);

            setError(
                "Une erreur est survenue lors de la génération du rapport."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleTelechargerPdf = async () => {

        try {

            setDownloading(true);
            setError("");

            const blob = await telechargerRapportPdf();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "rapport-inventaire-2026.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(error);

            setError(
                "Une erreur est survenue lors du téléchargement du PDF."
            );

        } finally {

            setDownloading(false);

        }
    };

    return (
        <div className="flex flex-col gap-5">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Rapports IA
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Génération automatique du rapport d'inventaire
                    à partir des données du système.
                </p>
            </div>


            {/* ACTIONS */}
            <div className="bg-white rounded-2xl shadow-md p-5">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                            <Sparkles
                                size={21}
                                className="text-slate-700"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-700">
                                Rapport d'inventaire 2026
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                Analyse générée automatiquement par l'IA.
                            </p>
                        </div>

                    </div>


                    <div className="flex gap-3">

                        <button
                            onClick={handleGenererRapport}
                            disabled={loading}
                            className="flex items-center justify-center gap-2
                            rounded-lg px-4 py-2.5
                            bg-slate-900 text-white
                            hover:bg-slate-800
                            transition-colors
                            disabled:opacity-60
                            disabled:cursor-not-allowed"
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />

                                    Génération en cours...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={17} />

                                    Générer le rapport IA
                                </>
                            )}

                        </button>


                        <button
                            onClick={handleTelechargerPdf}
                            disabled={!rapport || downloading}
                            className="flex items-center justify-center gap-2
                            rounded-lg px-4 py-2.5
                            border border-slate-300
                            text-slate-700
                            hover:bg-slate-50
                            transition-colors
                            disabled:opacity-50
                            disabled:cursor-not-allowed"
                        >

                            {downloading ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />

                                    Téléchargement...
                                </>
                            ) : (
                                <>
                                    <Download size={17} />

                                    Télécharger PDF
                                </>
                            )}

                        </button>

                    </div>

                </div>

            </div>


            {/* ERREUR */}
            {error && (

                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                    {error}
                </div>

            )}


            {/* CHARGEMENT */}
            {loading && (

                <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                    <Loader2
                        size={35}
                        className="animate-spin mx-auto text-slate-700"
                    />

                    <h3 className="font-semibold text-slate-700 mt-4">
                        Génération du rapport en cours...
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                        L'intelligence artificielle analyse les statistiques
                        de l'inventaire.
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                        Cette opération peut prendre quelques minutes.
                    </p>

                </div>

            )}


            {/* RAPPORT */}
            {rapport && !loading && (

                <div className="bg-white rounded-2xl shadow-md p-6">

                    <div className="flex items-center gap-3 border-b pb-4 mb-5">

                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <FileText
                                size={20}
                                className="text-slate-700"
                            />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-700">
                                Rapport généré
                            </h2>

                            <p className="text-xs text-gray-500">
                                Rapport d'inventaire du Centre CSZIAM
                            </p>
                        </div>

                    </div>


                    <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                        {rapport}
                    </div>

                </div>

            )}


            {/* ÉTAT INITIAL */}
            {!rapport && !loading && !error && (

                <div className="bg-white rounded-2xl shadow-md p-10 text-center">

                    <FileText
                        size={45}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="text-lg font-semibold text-slate-700 mt-4">
                        Aucun rapport généré
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        Cliquez sur « Générer le rapport IA »
                        pour créer votre rapport d'inventaire.
                    </p>

                </div>

            )}

        </div>
    );
}
"use client";

import { ArticleResponse } from "../../types/ArticleResponse";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ArticleDatatableProps = {
    articles: ArticleResponse[];
    onDelete: (id: number) => void;
};

export default function ArticleDatatable({
    articles,
    onDelete
}: ArticleDatatableProps) {

    const getEtatStyle = (etat: string) => {

        switch (etat?.toLowerCase()) {

            case "disponible":
                return "bg-green-100 text-green-700";

            case "en panne":
                return "bg-red-100 text-red-700";

            case "maintenance":
                return "bg-orange-100 text-orange-700";

            case "neuf":
                return "bg-blue-100 text-blue-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[900px] border-collapse text-sm">

                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">

                        <th className="p-3 text-left w-10">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                            />
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Désignation
                        </th>
                        <th className="p-3 text-left font-medium text-gray-500">
                            Catégorie
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            N° d'inventaire
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            État
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Date d'acquisition
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Valeur
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Affectation
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Actions
                        </th>

                    </tr>
                </thead>

                <tbody>

                    {articles.map((article) => (

                        <tr
                            key={article.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >

                            <td className="p-3">

                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                                />

                            </td>

                            <td className="p-3 font-medium text-gray-800">
                                {article.designation}
                            </td>
                            <td className="p-3 text-gray-500">
                                {article.categorieNom}
                            </td>
                            <td className="p-3 text-gray-500">
                                {article.numeroInventaire}
                            </td>

                            <td className="p-3">

                                <span
                                    className={`text-xs font-medium px-3 py-1 rounded-full ${getEtatStyle(
                                        article.etat
                                    )}`}
                                >
                                    {article.etat}
                                </span>

                            </td>

                            <td className="p-3 text-gray-500">
                                {article.dateAcquisition}
                            </td>

                            <td className="p-3 text-gray-500">
                                {article.valeur}
                            </td>

                            <td className="p-3 text-gray-500">
                                {article.affectation}
                            </td>

                            <td className="p-3">

                                <div className="flex gap-3">

                                    <Link
                                        href={`/admin/dashboard/articles/update/${article.id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Pencil size={16} />
                                    </Link>

                                    <button
                                        onClick={() => onDelete(article.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}
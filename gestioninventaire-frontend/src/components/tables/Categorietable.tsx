"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { CategorieResponse } from "../../types/CategorieResponse";

type CategorieDatatableProps = {
    categories: CategorieResponse[];
    onDelete: (id: number) => void;
};

export default function CategorieDatatable({
    categories,
    onDelete
}: CategorieDatatableProps) {

    return (

        <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[600px] border-collapse text-sm">

                <thead>

                    <tr className="bg-gray-50 border-b border-gray-200">

                        <th className="p-3 text-left w-10">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                            />
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            ID
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Nom
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Description
                        </th>

                        <th className="p-3 text-left font-medium text-gray-500">
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {categories.map((categorie) => (

                        <tr
                            key={categorie.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >

                            <td className="p-3">

                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                                />

                            </td>


                            <td className="p-3 text-gray-500">
                                {categorie.id}
                            </td>


                            <td className="p-3 font-medium text-gray-800">
                                {categorie.nom}
                            </td>


                            <td className="p-3 text-gray-500">
                                {categorie.description}
                            </td>


                            <td className="p-3">

                                <div className="flex gap-3">

                                    {/* MODIFIER */}

                                    <Link
                                        href={`/admin/dashboard/categorie/update/${categorie.id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >

                                        <Pencil size={16} />

                                    </Link>


                                    {/* SUPPRIMER */}

                                    <button
                                        onClick={() =>
                                            onDelete(categorie.id)
                                        }
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
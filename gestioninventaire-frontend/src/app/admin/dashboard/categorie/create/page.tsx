"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { createCategorie } from "@/src/Services/categorieService";

import { CategorieRequest } from "@/src/types/CategorieRequest";

export default function CreateCategoriePage() {

    const router = useRouter();

    const [form, setForm] =
        useState<CategorieRequest>({
            nom: "",
            description: ""
        });

    const [loading, setLoading] =
        useState(false);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setLoading(true);

        try {

            await createCategorie(form);

            router.push("/admin/dashboard/categorie");

        } catch (error) {

            console.log(error);

            alert(
                "Erreur lors de la création de la catégorie."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

           <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() =>
                    router.push("/admin/dashboard/categorie")
                }
            />


            <div className="relative bg-white rounded-2xl shadow-xl w-[500px] max-w-[90%] p-6">

                <div className="flex justify-between items-center mb-6">

                    <h1 className="text-xl font-semibold">
                        Ajouter une catégorie
                    </h1>

                    <button
                        onClick={() =>
                            router.push("/admin/dashboard/categorie")
                        }
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <X size={20} />
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Nom
                        </label>

                        <input
                            name="nom"
                            value={form.nom}
                            onChange={handleChange}
                            required
                            placeholder="Ex : Informatique"
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>
                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Description de la catégorie..."
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div className="flex justify-end gap-3 mt-4">

                        <button
                            type="button"
                            onClick={() =>
                                router.push("/admin/dashboard/categories")
                            }
                            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Création..."
                                : "Créer"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";

import {
    getCategorieById,
    updateCategorie
} from "@/src/Services/categorieService";

import { CategorieResponse } from "@/src/types/CategorieResponse";
import { CategorieRequest } from "@/src/types/CategorieRequest";

export default function UpdateCategoriePage() {

    const params = useParams();
    const router = useRouter();

    const id = Number(params.id);

    const [categorie, setCategorie] =
        useState<CategorieResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [form, setForm] =
        useState<CategorieRequest>({
            nom: "",
            description: ""
        });


    useEffect(() => {

        const fetchCategorie = async () => {

            try {

                const data =
                    await getCategorieById(id);

                setCategorie(data);

                setForm({
                    nom: data.nom,
                    description: data.description
                });

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchCategorie();

    }, [id]);


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

        try {

            await updateCategorie(id, form);

            router.push("/admin/dashboard/categorie");

        } catch (error) {

            console.log(error);

            alert(
                "Erreur lors de la modification de la catégorie."
            );

        }

    };


    if (loading) {

        return (
            <div className="fixed inset-0 flex items-center justify-center">
                Chargement...
            </div>
        );

    }


    if (!categorie) {

        return (
            <div className="fixed inset-0 flex items-center justify-center">
                Catégorie introuvable
            </div>
        );

    }


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-xl w-[500px] max-w-[90%] p-6">
                <div className="flex justify-between items-center mb-6">

                    <h1 className="text-xl font-semibold">
                        Modifier la catégorie
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
                                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                    </div>

                    <div className="flex justify-end gap-3 mt-4">

                        <button
                            type="button"
                            onClick={() =>
                                router.push("/admin/dashboard/categorie")
                            }
                            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Enregistrer
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}
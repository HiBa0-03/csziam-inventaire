"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";

import {
    getArticleById,
    updateArticle
} from "@/src/Services/articleService";

import { getCategories } from "@/src/Services/categorieService";

import { ArticleResponse } from "@/src/types/ArticleResponse";
import { ArticleRequest } from "@/src/types/ArticleRequest";
import { CategorieResponse } from "@/src/types/CategorieResponse";

export default function UpdateArticlePage() {

    const params = useParams();
    const router = useRouter();

    const id = Number(params.id);

    const [article, setArticle] =
        useState<ArticleResponse | null>(null);

    const [categories, setCategories] =
        useState<CategorieResponse[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [form, setForm] = useState<ArticleRequest>({
        designation: "",
        numeroInventaire: "",
        etat: "",
        dateAcquisition: "",
        valeur: 0,
        categorieId: 0,
    });

 
    useEffect(() => {

        const fetchCategories = async () => {

            try {

                const categoryList =
                    await getCategories();

                setCategories(categoryList);

            } catch (error) {

                console.log(
                    "Erreur lors du chargement des catégories :",
                    error
                );

            }

        };

        fetchCategories();

    }, []);



    useEffect(() => {

        const fetchArticle = async () => {

            try {

                const data =
                    await getArticleById(id);

                setArticle(data);

                setForm({
                    designation: data.designation,
                    numeroInventaire: data.numeroInventaire,
                    etat: data.etat,
                    dateAcquisition: data.dateAcquisition,
                    valeur: data.valeur,
                    categorieId: data.categorieId,
                });

            } catch (error) {

                console.log(
                    "Erreur lors du chargement de l'article :",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchArticle();

    }, [id]);

   
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,

            [name]:
                name === "valeur" ||
                name === "categorieId"
                    ? Number(value)
                    : value
        }));

    };

   

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            await updateArticle(id, form);

            router.push("/admin/dashboard/articles");

        } catch (error) {

            console.log(error);

            alert(
                "Erreur lors de la modification de l'article."
            );

        }

    };
    if (loading) {

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">

                <div className="bg-white rounded-xl p-6 shadow-lg">

                    Chargement...

                </div>

            </div>
        );

    }
    if (!article) {

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">

                <div className="bg-white rounded-xl p-6 shadow-lg">

                    Article introuvable

                </div>

            </div>
        );

    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b">

                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Modifier l'article
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Modifier les informations de l'article
                        </p>

                    </div>

                    <button type="button"
                        onClick={() =>router.push("/admin/dashboard/articles")}
                        className="text-gray-400 hover:text-gray-700">
                        <X size={22} />
                    </button>
                </div>


                <form onSubmit={handleSubmit} className="p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Désignation
                            </label>

                            <input type="text"
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                N° d'inventaire
                            </label>

                            <input type="text"name="numeroInventaire" value={form.numeroInventaire} onChange={handleChange}required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                État
                            </label>

                            <select name="etat" value={form.etat} onChange={handleChange} required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">

                                <option value="">
                                    Sélectionner un état
                                </option>

                                <option value="NEUF">
                                    Neuf
                                </option>

                                <option value="DISPONIBLE">
                                    Disponible
                                </option>

                                <option value="EN PANNE">
                                    En panne
                                </option>

                                <option value="MAINTENANCE">
                                    Maintenance
                                </option>

                            </select>

                        </div>
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date d'acquisition
                            </label>
                            <input type="date" name="dateAcquisition" value={form.dateAcquisition}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valeur
                            </label>

                            <input type="number" name="valeur"value={form.valeur} onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catégorie
                            </label>

                            <select name="categorieId" value={form.categorieId}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" >
                                <option value={0}>
                                    Sélectionner une catégorie
                                </option>

                                {categories.map((categorie) => (
                                    <option key={categorie.id} value={categorie.id}>
                                        {categorie.nom}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                    <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700">
                            Emplacement actuel
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {article.affectation || "Non affecté"}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                            L'emplacement est géré via les mouvements.
                        </p>

                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button type="button" 
                        onClick={() =>router.push("/admin/dashboard/articles")}
                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                            Annuler
                        </button>
                        <button type="submit"
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                            Enregistrer
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}
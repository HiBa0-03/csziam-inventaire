"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import CategorieDatatable from "@/src/components/tables/Categorietable";
import DeleteCategorieModal from "@/src/app/admin/dashboard/categorie/delete/DeleteCategorieModal";

import {
    getCategories,
    deleteCategorie
} from "@/src/Services/categorieService";

import { CategorieResponse } from "@/src/types/CategorieResponse";

export default function CategoriesPage() {

    const [categories, setCategories] =
        useState<CategorieResponse[]>([]);

    const [search, setSearch] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] =
        useState(false);

    const [selectedCategorieId, setSelectedCategorieId] =
        useState<number | null>(null);


    useEffect(() => {

        fetchCategories();

    }, []);


    const fetchCategories = async () => {

        try {

            const data = await getCategories();

            setCategories(data);

        } catch (error) {

            console.log(error);

        }

    };


    // Ouvre la modal
    const handleDeleteClick = (id: number) => {

        setSelectedCategorieId(id);

        setDeleteModalOpen(true);

    };


    // Confirme la suppression
    const handleDeleteConfirm = async () => {

        if (selectedCategorieId === null) {
            return;
        }

        try {

            await deleteCategorie(selectedCategorieId);

            setCategories((prev) =>
                prev.filter(
                    (categorie) =>
                        categorie.id !== selectedCategorieId
                )
            );

            setDeleteModalOpen(false);

            setSelectedCategorieId(null);

        } catch (error) {

            console.log(error);

            alert(
                "Erreur lors de la suppression de la catégorie."
            );

        }

    };


    // Recherche
    const filteredCategories =
        categories.filter((categorie) =>
            categorie.nom
                .toLowerCase()
                .includes(search.toLowerCase())
        );


    return (

        <div className="flex flex-col gap-6">

            <div className="flex justify-between items-center">

                <h1 className="flex items-center gap-2 text-2xl font-bold">

                    <Link href="/admin/dashboard">

                        <ChevronLeft />

                    </Link>

                    Gestion des catégories

                </h1>


                <Link href="/admin/dashboard/categorie/create">

                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        + Ajouter une catégorie
                    </button>

                </Link>

            </div>


            {/* SEARCH */}

            <div>

                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Rechercher une catégorie..."
                    className="w-80 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                <CategorieDatatable
                    categories={filteredCategories}
                    onDelete={handleDeleteClick}
                />

            </div>
            <DeleteCategorieModal
                open={deleteModalOpen}
                onCancel={() => {

                    setDeleteModalOpen(false);

                    setSelectedCategorieId(null);

                }}
                onConfirm={handleDeleteConfirm}
            />

        </div>

    );

}
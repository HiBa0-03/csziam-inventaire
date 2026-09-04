"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import ArticleDatatable from "@/src/components/tables/Articletable";
import DeleteArticleModal from "@/src/app/admin/dashboard/articles/delete/DeleteArticleModal";

import {
    getArticles,
    deleteArticle
} from "@/src/Services/articleService";

import { ArticleResponse } from "@/src/types/ArticleResponse";

export default function ArticlesPage() {

    const [articles, setArticles] = useState<ArticleResponse[]>([]);

    const [search, setSearch] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [selectedArticleId, setSelectedArticleId] =
        useState<number | null>(null);

    useEffect(() => {

        fetchArticles();

    }, []);

    const fetchArticles = async () => {

        try {

            const articleList = await getArticles();

            setArticles(articleList);

        } catch (error) {

            console.log(error);

        }

    };

    const handleDeleteClick = (id: number) => {

        setSelectedArticleId(id);

        setDeleteModalOpen(true);

    };

    const handleDeleteConfirm = async () => {

        if (selectedArticleId === null) {
            return;
        }

        try {

            await deleteArticle(selectedArticleId);

            setArticles((prev) =>
                prev.filter(
                    (article) => article.id !== selectedArticleId
                )
            );

            setDeleteModalOpen(false);

            setSelectedArticleId(null);

        } catch (error) {

            console.log(error);

            alert("Erreur lors de la suppression.");

        }

    };

    const filteredArticles = articles.filter((article) =>
        article.designation
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

                    Gestion des articles

                </h1>

                <Link href="/admin/dashboard/articles/create">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        + Ajouter un article
                    </button>

                </Link>

            </div>

            <div>
                <input type="text" value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un article..."
                    className="w-80 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                <ArticleDatatable articles={filteredArticles} onDelete={handleDeleteClick}/>

            </div>

            <DeleteArticleModal open={deleteModalOpen}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setSelectedArticleId(null);

                }}
                onConfirm={handleDeleteConfirm} />
        </div>

    );
}
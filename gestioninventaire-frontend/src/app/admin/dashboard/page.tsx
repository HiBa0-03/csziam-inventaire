"use client";

import { useEffect, useState } from "react";

import UserCard from "@/src/components/dashboard/UserCard";
import ArticleCard from "@/src/components/dashboard/articleCard";
import CategoryCard from "@/src/components/dashboard/categorieCard";
import Chart from "@/src/components/dashboard/chart";
import KpiCard from "@/src/components/dashboard/KpiCard";
import { getArticles } from "@/src/Services/articleService";
import { getUtilisateurs } from "@/src/Services/utilisateurService";
import { getMouvements } from "@/src/Services/MouvementService";

import { ArticleResponse } from "@/src/types/ArticleResponse";
import { UtilisateurResponse } from "@/src/types/UtilisateurResponse";
import { MouvementResponse } from "@/src/types/MouvementResponse";
import { getCurrentUser } from "@/src/Services/authService";

export default function Dashboard() {

    const [articles, setArticles] = useState<ArticleResponse[]>([]);
    const [utilisateurs, setUtilisateurs] = useState<UtilisateurResponse[]>([]);
    const [mouvements, setMouvements] = useState<MouvementResponse[]>([]);
 const [user, setUser] = useState<UtilisateurResponse | null>(null);
    useEffect(() => {

        const fetchData = async () => {

            try {
                const utilisateur = await getCurrentUser();
                setUser(utilisateur);
                setUtilisateurs(await getUtilisateurs());
                setArticles(await getArticles());
                setMouvements(await getMouvements());
                

            } catch (error) {
                console.log(error);
            }

        };

        fetchData();

    }, []);

    const affectations: Record<string, number> = {};

    for (const article of articles) {

        if (affectations[article.affectation]) {
            affectations[article.affectation]++;
        } else {
            affectations[article.affectation] = 1;
        }

    }

    const labels = Object.keys(affectations);
    const data = Object.values(affectations);

    const roles: Record<string, number> = {};

    for (const utilisateur of utilisateurs) {

        if (roles[utilisateur.roleUtilisateur]) {
            roles[utilisateur.roleUtilisateur]++;
        } else {
            roles[utilisateur.roleUtilisateur] = 1;
        }

    }

    const roleLabels = Object.keys(roles);
    const roleData = Object.values(roles);

    const mouvementCounts: Record<string, number> = {};

    for (const mouvement of mouvements) {

        if (mouvementCounts[mouvement.typeMouvement]) {
            mouvementCounts[mouvement.typeMouvement]++;
        } else {
            mouvementCounts[mouvement.typeMouvement] = 1;
        }

    }

    const mouvementLabels = Object.keys(mouvementCounts);
    const mouvementData = Object.values(mouvementCounts);

    const articlesDisponibles = articles.filter(
        (article) => article.etat?.toLowerCase() === "disponible"
    ).length;

    const tauxInventaire =
        articles.length > 0
            ? Math.round((articlesDisponibles / articles.length) * 100)
            : 0;

    return (
        <div className="flex flex-col gap-3">
   <div>

                <h1 className="text-2xl font-bold text-gray-800">

                    Bonjour{" "}

                    {user?.nom || "Admin"}

                </h1>


                <p className="text-sm text-gray-500 mt-1">

                    Bienvenue dans votre espace
                    admin.

                </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <UserCard utilisateurs={utilisateurs} />

                <ArticleCard articles={articles} />

            </div>
            <div className="flex justify-between gap-4">

    <div className="w-[22%]">
        <CategoryCard total={utilisateurs.length} />
    </div>

    <div className="w-[22%]">
        <KpiCard
            label="Disponibilité"
            value={`${tauxInventaire}%`}
            sublabel={`${articlesDisponibles} / ${articles.length} articles disponibles`} />
        </div>
    </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">

                <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-3">

                    <h2 className="text-base font-semibold text-slate-700 mb-1">
                        Utilisateurs par rôle
                    </h2>

                    <div className="relative h-[clamp(160px,24vh,320px)]">
                        <Chart
                            labels={roleLabels}
                            data={roleData}
                        />
                    </div>

                </div>

                <div className="lg:col-span-1 flex flex-col gap-3">
                    <div className="bg-white rounded-2xl shadow-md p-3">

                        <h2 className="text-xs font-semibold text-slate-700 mb-1">
                            Affectation des articles
                        </h2>

                        <div className="relative h-[clamp(90px,12vh,150px)]">
                            <Chart
                                type="pie"
                                labels={labels}
                                data={data}
                            />
                        </div>

                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-3">

                        <h2 className="text-xs font-semibold text-slate-700 mb-1">
                            Types de mouvements
                        </h2>

                        <div className="relative h-[clamp(90px,12vh,150px)]">
                            <Chart
                                type="pie"
                                labels={mouvementLabels}
                                data={mouvementData}
                            />
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { ArticleResponse } from "@/src/types/ArticleResponse";

type ArticleCardProps = {
  articles: ArticleResponse[];
};

export default function ArticleCard({ articles }: ArticleCardProps) {

  const derniersArticles = articles.slice(-3).reverse();

  const getEtatStyle = (etat: string) => {

    switch (etat.toLowerCase()) {

      case "disponible":
        return "bg-green-100 text-green-700";

      case "en panne":
        return "bg-red-100 text-red-700";

      case "maintenance":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }

  };

  return (

    <div className="bg-white rounded-xl border shadow-sm p-2">

      <div className="flex justify-between items-center mb-3">

        <h2 className="text-lg font-semibold text-slate-800">
          Articles
        </h2>

        <Link
          href="/admin/dashboard/articles"
          className="text-sm text-blue-600 hover:underline">
          View all →
        </Link>

      </div>

      <div className="space-y-2">

        {derniersArticles.map((article) => (

          <div
            key={article.id}
            className="flex justify-between items-center border-b pb-2 last:border-none"
          >

            <div className="flex items-center gap-3">

              <div className="bg-slate-100 rounded-full p-2">
                <Package size={18} />
              </div>

              <div>

                <p className="font-medium">
                  {article.designation}
                </p>

                <p className="text-sm text-gray-500">
                  {article.numeroInventaire}
                </p>

              </div>

            </div>

            <span className={`text-xs font-medium px-3 py-1 rounded-full ${getEtatStyle(article.etat)}`}>
              {article.etat}
            </span>

          </div>

        ))}

      </div>

    </div>

  );

}
"use client";
import Card from "@/src/components/Cards";
import { getUtilisateurs } from "../../Services/utilisateurService";
import { useEffect, useState } from "react";
import { UtilisateurResponse } from "../../types/UtilisateurResponse";
import { ArticleResponse } from "@/src/types/ArticleResponse";
import { getArticles } from "@/src/Services/articleService";
import Datatable from "@/src/components/Datatable";

export default function Dashboard()  {

    const [articles, setArticles] = useState<ArticleResponse[]>([]);

    const [utilisateurs, setUtilisateurs] = useState<UtilisateurResponse[]>([]);


   useEffect(() => {

    const fetchData = async () => {

        try {

            const utilisateurList = await getUtilisateurs();
            setUtilisateurs(utilisateurList);

            const articleList = await getArticles();
            setArticles(articleList);

        } catch (error) {
            console.log(error);
        }

    };

    fetchData();

}, []);


    return(
        <div className="flex flex-col gap-6 p-6"> 
            <h1>Dashboard admin</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               <Card title="Utilisateurs"
               value={utilisateurs.length}/>
               <Datatable articles={articles} />
               <Card title="Articles"
               value={articles.length}/>
        </div>

        </div>   
         )
   }
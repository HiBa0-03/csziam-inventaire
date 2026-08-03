import { ArticleResponse } from "../types/ArticleResponse";

type DataTableProps = {
    articles: ArticleResponse[];
};

export default function Datatable({ articles }: DataTableProps) {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Désignation</th>
                    <th>Numéro d'inventaire</th>
                    <th>État</th>
                    <th>Date d'acquisition</th>
                    <th>Valeur</th>
                </tr>
            </thead>

            <tbody>
                {articles.map((article) => (
                    <tr key={article.id}>
                        <td>{article.id}</td>
                        <td>{article.designation}</td>
                        <td>{article.numeroInventaire}</td>
                        <td>{article.etat}</td>
                        <td>{article.dateAcquisition}</td>
                        <td>{article.valeur}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export interface CampagneResponse {
    id: number;
    annee: number;
    dateDebut: string;
    dateFin: string;
    statut: string;
    totalArticles: number;
    articlesInventories: number;
    progression: number;
}
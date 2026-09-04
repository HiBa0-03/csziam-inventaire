export interface MouvementRequest {
    date: string;
    typeMouvement:string;
    motif: string;
    articleId: number;
    laboratoireId?: number;
    serviceId?: number;
    utilisateurId?: number;
}
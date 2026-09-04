
export interface MouvementResponse {
    id: number;
    typeMouvement: string;
    date: string;
    motif: string;
    ancienneLocalisation: string;
    nouvelleLocalisation: string;
    articleId: number;
    articleDesignation?: string;

    laboratoireId?: number;
    laboratoireNom?: string;

    serviceId?: number;
    serviceNom?: string;
    utilisateurId?: number;
    utilisateurNom:string;


}


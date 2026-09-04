export interface ArticleRequest {
    designation: string;
    numeroInventaire: string;
    etat: string;
    dateAcquisition: string;
    valeur: number;
    categorieId: number;
    laboratoireId?: number;
    serviceId?: number;
}
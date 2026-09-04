export interface ArticleResponse {
  id: number;
  designation: string;
  numeroInventaire: string;
  etat: string;
  dateAcquisition: string;
  valeur: number;
    categorieId: number;
    categorieNom: string;
    laboratoireId?: number;
    serviceId?: number;
    affectation: string;
  }




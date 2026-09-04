export interface UtilisateurResponse {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  roleUtilisateur: string;
  
    serviceId?: number | null;
    serviceNom?: string | null;

    laboratoireId?: number | null;
    laboratoireNom?: string | null;
}
 

  

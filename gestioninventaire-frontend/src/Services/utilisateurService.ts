import api from "./api";
import { UtilisateurResponse } from "../types/UtilisateurResponse";

export const getUtilisateurs = async (): Promise<UtilisateurResponse[]> => {
    const response = await api.get("/utilisateurs");
    return response.data;
}
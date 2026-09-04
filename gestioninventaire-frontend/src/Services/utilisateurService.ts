import api from "./api";

import { UtilisateurResponse } from "../types/UtilisateurResponse";
import { UtilisateurRequest } from "../types/UtilisateurRequest";

export const getUtilisateurs = async (): Promise<UtilisateurResponse[]> => {

    const response = await api.get("/utilisateurs");

    return response.data;
};


export const getUtilisateurById = async (id: number): Promise<UtilisateurResponse> => {

    const response = await api.get(`/utilisateurs/${id}`);

    return response.data;
};


export const createUtilisateur = async (utilisateur: UtilisateurRequest): Promise<UtilisateurResponse> => {

    const response = await api.post(
        "/utilisateurs",
        utilisateur
    );

    return response.data;
};


export const updateUtilisateur = async (id: number, utilisateur: UtilisateurRequest): Promise<UtilisateurResponse> => {

    const response = await api.put(
        `/utilisateurs/${id}`,
        utilisateur
    );

    return response.data;
};


export const deleteUtilisateur = async (id: number): Promise<void> => {

    await api.delete(`/utilisateurs/${id}`);

};
import api from "./api";

import { InventaireResponse } from "../types/InventaireResponse";
import { InventaireRequest } from "../types/InventaireRequest";

export const getInventaires = async (): Promise<InventaireResponse[]> => {

    const response = await api.get("/inventaires");

    return response.data;
};


export const getInventaireById = async (id: number): Promise<InventaireResponse> => {

    const response = await api.get(`/inventaires/${id}`);

    return response.data;
};


export const createInventaire = async (inventaire: InventaireRequest): Promise<InventaireResponse> => {

    const response = await api.post(
        "/inventaires",
        inventaire
    );

    return response.data;
};
export const getInventairesByCampagne = async (campagneId: number): Promise<InventaireResponse[]> => {
    const response = await api.get(  `/inventaires/campagne/${campagneId}`);
    return response.data;
};
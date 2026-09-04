import api from "./api";

import { CampagneRequest } from "../types/CampagneRequest";
import { InventaireResponse } from "../types/InventaireResponse";

import { CampagneResponse } from "../types/CampagneResponse";

export const getCampagnes = async (): Promise<CampagneResponse[]> => {
    const response = await api.get("/campagnes");
    return response.data;
};

export const getCampagneById = async (id: number): Promise<CampagneResponse> => {
    const response = await api.get(`/campagnes/${id}`);
    return response.data;
};

export const createCampagne = async (campagne: CampagneRequest): Promise<CampagneResponse> => {
    const response = await api.post("/campagnes", campagne);
    return response.data;
};


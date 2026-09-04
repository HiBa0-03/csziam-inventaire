import api from "./api";
import { MouvementResponse } from "../types/MouvementResponse";
import {MouvementRequest}from "../types/MouvementRequest"

export const getMouvements = async (): Promise<MouvementResponse[]> => {
    const response = await api.get("/mouvements");
    return response.data;
}
export const createMouvement = async ( mouvement: MouvementRequest): Promise<MouvementResponse> => {
    const response = await api.post("/mouvements", mouvement);
    return response.data;
};


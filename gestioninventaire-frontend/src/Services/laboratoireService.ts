import api from "./api";

import { LaboratoireResponse } from "../types/LaboratoireResponse";
import { LaboratoireRequest } from "../types/LaboratoireRequest";


export const getLaboratoires =
    async (): Promise<LaboratoireResponse[]> => {

        const response =
            await api.get("/laboratoires");

        return response.data;
    };


export const getLaboratoireById =
    async (id: number): Promise<LaboratoireResponse> => {

        const response =
            await api.get(`/laboratoires/${id}`);

        return response.data;
    };


export const createLaboratoire =
    async (
        laboratoire: LaboratoireRequest
    ): Promise<LaboratoireResponse> => {

        const response =
            await api.post(
                "/laboratoires",
                laboratoire
            );

        return response.data;
    };
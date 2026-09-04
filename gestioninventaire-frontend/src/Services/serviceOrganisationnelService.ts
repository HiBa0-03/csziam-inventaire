import api from "./api";

import { ServiceResponse } from "../types/ServiceResponse";
import { ServiceRequest } from "../types/ServiceRequest";


export const getServices = async (): Promise<ServiceResponse[]> => {

    const response = await api.get("/services");

    return response.data;
};


export const getServiceById = async (
    id: number
): Promise<ServiceResponse> => {

    const response = await api.get(`/services/${id}`);

    return response.data;
};


export const createService = async (
    service: ServiceRequest
): Promise<ServiceResponse> => {

    const response = await api.post(
        "/services",
        service
    );

    return response.data;
};
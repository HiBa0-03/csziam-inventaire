import api from "./api";

import { CategorieResponse } from "../types/CategorieResponse";
import { CategorieRequest } from "../types/CategorieRequest";


export const getCategories = async (): Promise<CategorieResponse[]> => {

    const response = await api.get("/categories");

    return response.data;
};


export const getCategorieById = async (id: number): Promise<CategorieResponse> => {

    const response = await api.get(`/categories/${id}`);

    return response.data;
};


export const createCategorie = async (categorie: CategorieRequest): Promise<CategorieResponse> => {

    const response = await api.post(
        "/categories",
        categorie
    );

    return response.data;
};


export const updateCategorie = async ( id: number,categorie: CategorieRequest): Promise<CategorieResponse> => {

    const response = await api.put(
        `/categories/${id}`,
        categorie
    );

    return response.data;
};


export const deleteCategorie = async (id: number): Promise<void> => {

    await api.delete(`/categories/${id}`);

};
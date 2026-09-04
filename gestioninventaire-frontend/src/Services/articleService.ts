import api from "./api";

import { ArticleResponse } from "../types/ArticleResponse";
import { ArticleRequest } from "../types/ArticleRequest";

export const getArticles = async (): Promise<ArticleResponse[]> => {

    const response = await api.get("/articles");

    return response.data;
};


export const getArticleById = async (
    id: number
): Promise<ArticleResponse> => {

    const response = await api.get(`/articles/${id}`);

    return response.data;
};


export const createArticle = async (
    article: ArticleRequest
): Promise<ArticleResponse> => {

    const response = await api.post("/articles", article);

    return response.data;
};
export const updateArticle = async ( id: number,article: ArticleRequest): Promise<ArticleResponse> => {

    const response = await api.put(`/articles/${id}`, article);

    return response.data;
};

export const deleteArticle = async (id: number): Promise<void> => {

    await api.delete(`/articles/${id}`);

};
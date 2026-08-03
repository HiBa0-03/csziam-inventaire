import api from "./api";
import { ArticleResponse } from "../types/ArticleResponse";

export const getArticles = async (): Promise<ArticleResponse[]> => {
    const response = await api.get("/articles");
    return response.data;
}
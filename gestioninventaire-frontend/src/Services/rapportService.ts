import api from "./api";

/**
 * Génère le rapport avec l'IA.
 * Cette opération peut prendre plusieurs minutes
 * car Ollama génère le contenu.
 */
export const genererRapport = async (): Promise<string> => {
    const response = await api.post("/api/rapports/generer");

    return response.data;
};

/* Télécharge le dernier rapport généré sous forme de PDF.*/
export const telechargerRapportPdf = async (): Promise<Blob> => {
    const response = await api.get("/api/rapports/pdf", {
        responseType: "blob",
    });

    return response.data;
};
import api from "./api";
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
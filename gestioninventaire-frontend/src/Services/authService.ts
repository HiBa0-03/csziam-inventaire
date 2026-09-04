import api from "./api";

import { AuthenticationRequest } from "../types/AuthenticationRequest";
import { AuthenticationResponse } from "../types/AuthenticationResponse";
import { saveToken } from "@/src/Services/tokenService";
import { UtilisateurResponse } from "../types/UtilisateurResponse";

export const login = async (authRequest: AuthenticationRequest): Promise<AuthenticationResponse> => {

const response = await api.post("/auth/login",authRequest);

saveToken(response.data.token);

return response.data;

};

export const getCurrentUser = async (): Promise<UtilisateurResponse> => {

const response = await api.get("/auth/current");

return response.data;

};

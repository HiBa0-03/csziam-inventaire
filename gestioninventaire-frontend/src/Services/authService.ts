import api from "./api";
import { AuthenticationRequest } from "../types/AuthenticationRequest";
import { AuthenticationResponse } from "../types/AuthenticationResponse";
import { saveToken } from "@/src/Services/tokenService";

export const login = async (authRequest: AuthenticationRequest) => {
    const response = await api.post("/auth/login", authRequest);
      saveToken(response.data.token);
    return response.data as AuthenticationResponse;
};
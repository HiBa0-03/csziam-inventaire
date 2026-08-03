"use client";

import type { FormEvent } from "react";
import { AuthenticationRequest } from "../../types/AuthenticationRequest";
import { login } from "../../Services/authService";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const initialRequest: AuthenticationRequest = {
    email: "",
    motDePasse: ""
};

const [authRequest, setAuthRequest] = useState(initialRequest);

const router = useRouter();


const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();

    try {
        const response = await login(authRequest);

        console.log(response);
    
         router .push("/dashboard");

          
    } catch(error) {

        console.log(error);

    }

};
return (
    <div>
        <h1>Login</h1> 
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={authRequest.email}
                onChange={(e) => setAuthRequest({ 
                    ...authRequest,
                     email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={authRequest.motDePasse}
                onChange={(e) => setAuthRequest({
                     ...authRequest,
                      motDePasse: e.target.value })}
            />
            <button type="submit">Se connecter</button>
        </form>
    </div>
)
}
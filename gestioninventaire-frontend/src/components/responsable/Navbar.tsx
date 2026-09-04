"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/src/Services/authService";

export default function ResponsableNavbar() {

  const [nom, setNom] = useState("Responsable");

  
  useEffect(() => {

    const loadUser = async () => {

      try {

        const utilisateur = await getCurrentUser();

        setNom(utilisateur.nom);

      } catch (error) {

        console.error(
          "Erreur lors du chargement de l'utilisateur",
          error
        );

      }

    };

    loadUser();

  }, []);

  function getInitiales(nom: string): string {

if (!nom) {
return "U";
}

const mots = nom
.trim()
.split(/\s+/)
.filter(Boolean);

if (mots.length === 1) {
return mots[0]
.substring(0, 2)
.toUpperCase();
}

return (
mots[0][0] +
mots[1][0]
).toUpperCase();
}

  return (

    <header
      className="
        h-15
        bg-white
        border-b
        flex
        items-center
        justify-between
        px-8
        shadow-sm
      "
    >

      <div>

        <h1 className="font-semibold text-xl text-slate-800">
          Espace responsable
        </h1>

      </div>

      <div className="flex items-center gap-5">

        <Bell
          size={22}
          className="cursor-pointer text-slate-600"
        />

        <div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">

        {getInitiales(nom)}

      </div>


          <div>

            <p className="font-medium">
              {nom}
            </p>

            <p className="text-xs text-gray-500">
              Responsable
            </p>

          </div>

        </div>

      </div>

    </header>

  );
}
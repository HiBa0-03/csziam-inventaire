"use client";

import { useEffect, useMemo, useState } from "react";
import {
ArrowLeft,
CheckCircle,
ClipboardCheck,
Loader2,
Search,
XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/src/Services/authService";
import { getCampagnes } from "@/src/Services/campagneService";
import { getInventairesByCampagne } from "@/src/Services/inventaireService";
import { getArticles } from "@/src/Services/articleService";

import { UtilisateurResponse } from "@/src/types/UtilisateurResponse";
import { InventaireResponse } from "@/src/types/InventaireResponse";

export default function ResponsableInventairePage() {
const router = useRouter();

const [user, setUser] = useState<UtilisateurResponse | null>(null);
const [inventaires, setInventaires] = useState<InventaireResponse[]>([]);
const [search, setSearch] = useState("");
const [campagneAnnee, setCampagneAnnee] = useState<number | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchData = async () => {
try {
const currentUser = await getCurrentUser();
    if (currentUser.roleUtilisateur !== "RESPONSABLE") {
      router.push("/responsable/dashboard");
      return;
    }

    setUser(currentUser);

    const [campagnes, articles] = await Promise.all([
      getCampagnes(),
      getArticles(),
    ]);

    const campagneEnCours = campagnes.find(
      (c) => c.statut === "EN_COURS"
    );

    if (!campagneEnCours) {
      setInventaires([]);
      setLoading(false);
      return;
    }

    setCampagneAnnee(campagneEnCours.annee);

    const data = await getInventairesByCampagne(
      campagneEnCours.id
    );

    const mesArticles = articles.filter((article) => {
      if (currentUser.serviceId) {
        return article.serviceId === currentUser.serviceId;
      }

      if (currentUser.laboratoireId) {
        return article.laboratoireId === currentUser.laboratoireId;
      }

      return false;
    });

    const numerosInventaire = new Set(
      mesArticles.map((article) => article.numeroInventaire)
    );

    
  } catch (error) {
    console.error(
      "Erreur lors du chargement de l'inventaire :",
      error
    );
  } finally {
    setLoading(false);
  }
};

fetchData();

}, [router]);

const inventairesFiltres = useMemo(() => {
const value = search.toLowerCase();
return inventaires
  .filter((inventaire) => {
    return (
      inventaire.articleDesignation
        ?.toLowerCase()
        .includes(value) ||
      inventaire.commentaire
        ?.toLowerCase()
        .includes(value)
    );
  })
  .sort(
    (a, b) =>
      new Date(b.dateVerification).getTime() -
      new Date(a.dateVerification).getTime()
  );

}, [inventaires, search]);

const total = inventaires.length;

const presents = inventaires.filter(
(i) => i.statutPresence === "PRESENT"
).length;

const absents = inventaires.filter(
(i) => i.statutPresence === "ABSENT"
).length;

const progression = total > 0 ? 100 : 0;

if (loading) {
return ( <div className="flex items-center justify-center min-h-[400px]"> <Loader2
       size={22}
       className="animate-spin text-gray-400"
     /> <span className="ml-2 text-gray-500">
Chargement... </span> </div>
);
}

return ( <div className="w-full min-w-0 p-6 space-y-6 overflow-x-hidden"> <div className="flex items-center gap-3">
<button
onClick={() =>
router.push("/responsable/dashboard")
}
className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
> <ArrowLeft size={22} /> </button>

    <div className="bg-blue-100 p-3 rounded-xl">
      <ClipboardCheck
        size={24}
        className="text-blue-600"
      />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-slate-800">
        Inventaire
      </h1>

      <p className="text-sm text-gray-500">
        Suivi de l'inventaire de votre patrimoine
      </p>
    </div>
  </div>

  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500">
          Campagne d'inventaire en cours
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-1">
          Campagne {campagneAnnee ?? "—"}
        </h2>
      </div>

      <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm font-medium">
        <ClipboardCheck size={16} />
        En cours
      </span>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Matériels inventoriés
          </p>

          <p className="text-3xl font-bold text-slate-800 mt-1">
            {total}
          </p>
        </div>

        <div className="bg-blue-100 p-3 rounded-xl">
          <ClipboardCheck
            size={22}
            className="text-blue-600"
          />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Présents
          </p>

          <p className="text-3xl font-bold text-green-600 mt-1">
            {presents}
          </p>
        </div>

        <div className="bg-green-100 p-3 rounded-xl">
          <CheckCircle
            size={22}
            className="text-green-600"
          />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Absents
          </p>

          <p className="text-3xl font-bold text-red-600 mt-1">
            {absents}
          </p>
        </div>

        <div className="bg-red-100 p-3 rounded-xl">
          <XCircle
            size={22}
            className="text-red-600"
          />
        </div>
      </div>
    </div>
  </div>

  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-semibold text-lg text-slate-800">
          Progression de l'inventaire
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          État des vérifications de votre patrimoine
        </p>
      </div>

      <span className="text-xl font-bold text-blue-600">
        {progression}%
      </span>
    </div>

    <div className="w-full bg-gray-100 rounded-full h-3">
      <div
        className="bg-blue-600 h-3 rounded-full transition-all"
        style={{ width: `${progression}%` }}
      />
    </div>

    <p className="text-sm text-gray-500 mt-2">
      {total} matériel(s) vérifié(s)
    </p>
  </div>

  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <div className="relative">
      <Search
        size={19}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un matériel..."
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100">
      <h2 className="font-semibold text-lg text-slate-800">
        Vérifications effectuées
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Inventaire de votre patrimoine pour la campagne en cours.
      </p>
    </div>

    <div className="w-full max-w-full overflow-x-auto">
      <table className="w-full min-w-[800px] text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-5 py-3 font-medium text-gray-600">
              Matériel
            </th>

            <th className="text-left px-5 py-3 font-medium text-gray-600">
              N° inventaire
            </th>

            <th className="text-left px-5 py-3 font-medium text-gray-600">
              Date
            </th>

            <th className="text-left px-5 py-3 font-medium text-gray-600">
              Présence
            </th>

            <th className="text-left px-5 py-3 font-medium text-gray-600">
              Commentaire
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {inventairesFiltres.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-12 text-gray-500"
              >
                Aucun inventaire trouvé.
              </td>
            </tr>
          ) : (
            inventairesFiltres.map((inventaire) => (
              <tr
                key={inventaire.id}
                className="hover:bg-gray-50"
              >
                <td className="px-5 py-4 font-medium text-gray-800">
                  {inventaire.articleDesignation}
                </td>

            
                <td className="px-5 py-4 text-gray-600">
                  {inventaire.dateVerification || "—"}
                </td>

                <td className="px-5 py-4">
                  {inventaire.statutPresence === "PRESENT" ? (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      <CheckCircle size={14} />
                      Présent
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      <XCircle size={14} />
                      Absent
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {inventaire.commentaire ||
                    "Aucun commentaire."}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

);
}

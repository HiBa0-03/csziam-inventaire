"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CalendarPlus, X } from "lucide-react";

import { createCampagne } from "@/src/Services/campagneService";

export default function CreateCampagnePage() {

    const router = useRouter();


    const [form, setForm] = useState({

        dateDebut: "",

        dateFin: ""

    });


    const [loading, setLoading] = useState(false);

        const handleChange = (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {

            const { name, value } = e.target;

            setForm((prev) => ({

                ...prev,

                [name]: value

            }));

        };


   const handleSubmit = async (
    e: React.FormEvent
) => {

    e.preventDefault();

    if (!form.dateDebut || !form.dateFin) {

        alert("Veuillez renseigner les dates.");

        return;
    }

    if (form.dateFin < form.dateDebut) {

        alert(
            "La date de fin doit être après la date de début."
        );

        return;
    }

    // L'année est automatiquement récupérée depuis la date de début
    const annee = Number(
        form.dateDebut.substring(0, 4)
    );

    const campagneData = {
        annee: annee,
        dateDebut: form.dateDebut,
        dateFin: form.dateFin
    };

    try {

        setLoading(true);

        console.log("Données envoyées :", campagneData);

        await createCampagne(campagneData);

        router.push("/admin/dashboard/campaigns");

    } catch (error) {

        console.log(error);

        alert(
            "Erreur lors de la création de la campagne."
        );

    } finally {

        setLoading(false);

    }
};

    return (

       

 <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => router.push("/admin/dashboard/campaigns")}/>

            <div className="relative z-10 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                        Nouvelle campagne
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                        Créer une nouvelle campagne d'inventaire
                        </p>

                    </div>

                    <button type="button"
                        onClick={() => router.push("/admin/dashboard/campaigns")}
                        className="p-2 rounded-lg hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 rounded-full p-3">
                        <CalendarPlus size={22} className="text-blue-700"/>
                    </div>

                    <div>

                        <h2 className="text-lg font-semibold text-gray-800">

                            Informations de la campagne
                        </h2>

                        <p className="text-sm text-gray-500">
                            Définissez l'année et la période de l'inventaire.
                        </p>

                    </div>

                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de début
                    </label>

                    <input type="date"
                        name="dateDebut"
                        value={form.dateDebut}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de fin

                    </label>

                    <input type="date"
                        name="dateFin"
                        value={form.dateFin}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                    <button type="button"
                        onClick={() =>router.push("/admin/dashboard/campaigns")}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Annuler
                    </button>

                    <button type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                        {loading ? "Création...": "Créer la campagne"}
                    </button>
                </div>
            </form>

            </div>

        </div>

    );

}
   
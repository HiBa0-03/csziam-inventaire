"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { createUtilisateur } from "@/src/Services/utilisateurService";
import { getServices } from "@/src/Services/serviceOrganisationnelService";
import { getLaboratoires } from "@/src/Services/laboratoireService";

import { UtilisateurRequest } from "@/src/types/UtilisateurRequest";
import { ServiceResponse } from "@/src/types/ServiceResponse";
import { LaboratoireResponse } from "@/src/types/LaboratoireResponse";

export default function CreateUtilisateurPage() {

    const router = useRouter();

    const [form, setForm] = useState<UtilisateurRequest>({
        nom: "",
        email: "",
        motDePasse: "",
        telephone: "",
        roleUtilisateur: "",
        serviceId: undefined,
        laboratoireId: undefined
    });

    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [laboratoires, setLaboratoires] = useState<LaboratoireResponse[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {

        const chargerDonnees = async () => {

            try {

                const [servicesData, laboratoiresData] =
                    await Promise.all([
                        getServices(),
                        getLaboratoires()
                    ]);

                setServices(servicesData);
                setLaboratoires(laboratoiresData);

            } catch (error) {

                console.error(
                    "Erreur lors du chargement des services/laboratoires :",
                    error
                );

                alert(
                    "Impossible de charger les services et laboratoires."
                );

            } finally {

                setLoadingData(false);

            }

        };

        chargerDonnees();

    }, []);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        const { name, value } = e.target;

        setForm(prev => {

            const nouveauForm = {
                ...prev,
                [name]:
                    name === "serviceId" ||
                    name === "laboratoireId"
                        ? value === ""
                            ? undefined
                            : Number(value)
                        : value
            };

            /*Si le rôle n'est pas RESPONSABLE on supprime automatiquement l'affectation*/
            if (
                name === "roleUtilisateur" &&
                value !== "RESPONSABLE"
            ) {

                nouveauForm.serviceId = undefined;
                nouveauForm.laboratoireId = undefined;

            }

            return nouveauForm;

        });

    };


    const choisirAffectation = (
        type: "service" | "laboratoire"
    ) => {

        setForm(prev => {

            if (type === "service") {

                return {
                    ...prev,
                    laboratoireId: undefined
                };

            }

            return {
                ...prev,
                serviceId: undefined
            };

        });

    };


    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();
        if (form.roleUtilisateur === "RESPONSABLE") {

            if (
                form.serviceId !== undefined &&
                form.laboratoireId !== undefined
            ) {

                alert(
                    "Un responsable ne peut être affecté qu'à un service OU à un laboratoire."
                );

                return;

            }

            if (
                form.serviceId === undefined &&
                form.laboratoireId === undefined
            ) {

                alert(
                    "Veuillez affecter le responsable à un service ou à un laboratoire."
                );

                return;

            }

        }

        /* ADMIN et AGENT ne doivent pas avoir de service/laboratoire.*/
        if (form.roleUtilisateur !== "RESPONSABLE") {

            form.serviceId = undefined;
            form.laboratoireId = undefined;

        }

        try {

            setLoading(true);

            await createUtilisateur(form);

            router.push(
                "/admin/dashboard/utilisateurs"
            );

        } catch (error) {

            console.error(
                "Erreur création utilisateur :",
                error
            );

            alert(
                "Erreur lors de la création de l'utilisateur."
            );

        } finally {

            setLoading(false);

        }

    };


    if (loadingData) {

        return (

            <div className="fixed inset-0 z-50 flex items-center justify-center">

                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

                <div className="relative bg-white rounded-2xl shadow-xl p-8">

                    Chargement...

                </div>

            </div>

        );

    }


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            <div className="relative bg-white rounded-2xl shadow-xl w-[500px] max-w-[90%] p-6 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-6">

                    <h1 className="text-xl font-semibold">
                        Ajouter un utilisateur
                    </h1>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/dashboard/utilisateurs"
                            )
                        }
                        className="text-gray-500 hover:text-gray-800"
                    >

                        <X size={20} />

                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Nom
                        </label>

                        <input
                            name="nom"
                            value={form.nom}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>
                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>
                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Mot de passe
                        </label>

                        <input
                            type="password"
                            name="motDePasse"
                            value={form.motDePasse}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>
                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Téléphone
                        </label>

                        <input
                            type="tel"
                            name="telephone"
                            value={form.telephone}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Rôle
                        </label>

                        <select
                            name="roleUtilisateur"
                            value={form.roleUtilisateur}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="">
                                Sélectionner un rôle
                            </option>

                            <option value="ADMIN">
                                Administrateur
                            </option>

                            <option value="RESPONSABLE">
                                Responsable
                            </option>

                            <option value="AGENT_INVENTAIRE">
                                Agent d'inventaire
                            </option>

                        </select>

                    </div>

                    {form.roleUtilisateur === "RESPONSABLE" && (

                        <div className="border rounded-xl p-4 bg-gray-50">

                            <label className="block text-sm font-medium mb-3">
                                Affectation du responsable
                            </label>

                            <p className="text-xs text-gray-500 mb-4">
                                Un responsable doit appartenir à un
                                service ou à un laboratoire.
                            </p>

                            <div className="mb-4">

                                <label className="block text-sm font-medium mb-1">
                                    Service
                                </label>

                                <select
                                    name="serviceId"
                                    value={
                                        form.serviceId ?? ""
                                    }
                                    onChange={(e) => {

                                        choisirAffectation(
                                            "service"
                                        );

                                        handleChange(e);

                                    }}
                                    className="w-full border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="">
                                        Aucun service
                                    </option>

                                    {services.map(service => (

                                        <option
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.nom}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            <div className="text-center text-xs text-gray-400 mb-4">
                                OU
                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Laboratoire
                                </label>

                                <select
                                    name="laboratoireId"
                                    value={
                                        form.laboratoireId ?? ""
                                    }
                                    onChange={(e) => {

                                        choisirAffectation(
                                            "laboratoire"
                                        );

                                        handleChange(e);

                                    }}
                                    className="w-full border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="">
                                        Aucun laboratoire
                                    </option>

                                    {laboratoires.map(laboratoire => (

                                        <option
                                            key={laboratoire.id}
                                            value={laboratoire.id}
                                        >
                                            {laboratoire.nom}
                                        </option>

                                    ))}

                                </select>

                            </div>

                        </div>

                    )}

                    <div className="flex justify-end gap-3 mt-4">

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/admin/dashboard/utilisateurs"
                                )
                            }
                            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                            Annuler
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >

                            {loading
                                ? "Création..."
                                : "Ajouter"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}
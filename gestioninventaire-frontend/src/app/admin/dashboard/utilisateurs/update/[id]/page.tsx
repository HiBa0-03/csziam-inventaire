"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";

import {
    getUtilisateurById,
    updateUtilisateur
} from "@/src/Services/utilisateurService";

import {
    getServices
} from "@/src/Services/serviceOrganisationnelService";

import {
    getLaboratoires
} from "@/src/Services/laboratoireService";

import { UtilisateurResponse } from "@/src/types/UtilisateurResponse";
import { UtilisateurRequest } from "@/src/types/UtilisateurRequest";
import { ServiceResponse } from "@/src/types/ServiceResponse";
import { LaboratoireResponse } from "@/src/types/LaboratoireResponse";

export default function UpdateUtilisateurPage() {

    const params = useParams();
    const router = useRouter();

    const id = Number(params.id);

    const [utilisateur, setUtilisateur] =
        useState<UtilisateurResponse | null>(null);

    const [services, setServices] =
        useState<ServiceResponse[]>([]);

    const [laboratoires, setLaboratoires] =
        useState<LaboratoireResponse[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [form, setForm] =
        useState<UtilisateurRequest>({
            nom: "",
            email: "",
            motDePasse: "",
            telephone: "",
            roleUtilisateur: "",
            serviceId: undefined,
            laboratoireId: undefined
        });


    useEffect(() => {

        const fetchData = async () => {

            try {

                const [
                    utilisateurData,
                    servicesData,
                    laboratoiresData
                ] = await Promise.all([
                    getUtilisateurById(id),
                    getServices(),
                    getLaboratoires()
                ]);

                setUtilisateur(utilisateurData);

                setServices(servicesData);
                setLaboratoires(laboratoiresData);

                setForm({

                    nom: utilisateurData.nom,

                    email: utilisateurData.email,

                    motDePasse: "",

                    telephone: utilisateurData.telephone,

                    roleUtilisateur:
                        utilisateurData.roleUtilisateur,

                    serviceId:
                        utilisateurData.serviceId,

                    laboratoireId:
                        utilisateurData.laboratoireId

                });

            } catch (error) {

                console.error(
                    "Erreur chargement utilisateur :",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, [id]);


    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement
        >
    ) => {

        const {
            name,
            value
        } = e.target;

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

            if (
                name === "roleUtilisateur" &&
                value !== "RESPONSABLE"
            ) {

                nouveauForm.serviceId =
                    undefined;

                nouveauForm.laboratoireId =
                    undefined;

            }

            return nouveauForm;

        });

    };


    const choisirService = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const value = e.target.value;

        setForm(prev => ({

            ...prev,

            serviceId:
                value === ""
                    ? undefined
                    : Number(value),

            laboratoireId:
                undefined

        }));

    };


    const choisirLaboratoire = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const value = e.target.value;

        setForm(prev => ({

            ...prev,

            laboratoireId:
                value === ""
                    ? undefined
                    : Number(value),

            serviceId:
                undefined

        }));

    };


    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        if (
            form.roleUtilisateur ===
            "RESPONSABLE"
        ) {

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


        if (
            form.roleUtilisateur !==
            "RESPONSABLE"
        ) {

            form.serviceId =
                undefined;

            form.laboratoireId =
                undefined;

        }


        try {

            setSaving(true);

            await updateUtilisateur(
                id,
                form
            );

            router.push(
                "/admin/dashboard/utilisateurs"
            );

        } catch (error) {

            console.error(
                "Erreur modification utilisateur :",
                error
            );

            alert(
                "Erreur lors de la modification."
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (

            <div className="fixed inset-0 flex items-center justify-center">

                Chargement...

            </div>

        );

    }


    if (!utilisateur) {

        return (

            <div className="fixed inset-0 flex items-center justify-center">

                Utilisateur introuvable

            </div>

        );

    }


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            <div className="relative bg-white rounded-2xl shadow-xl w-[500px] max-w-[90%] p-6 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-6">

                    <h1 className="text-xl font-semibold">
                        Modifier l'utilisateur
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
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Nouveau mot de passe
                        </label>

                        <input
                            type="password"
                            name="motDePasse"
                            value={form.motDePasse}
                            onChange={handleChange}
                            placeholder="Laisser vide pour conserver l'ancien"
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
                            className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >

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
                                Un responsable appartient à un
                                seul service ou à un seul laboratoire.
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
                                    onChange={
                                        choisirService
                                    }
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
                                    onChange={
                                        choisirLaboratoire
                                    }
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
                            disabled={saving}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >

                            {saving
                                ? "Enregistrement..."
                                : "Enregistrer"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}
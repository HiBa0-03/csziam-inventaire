"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { createService } from "@/src/Services/serviceOrganisationnelService";
import { ServiceRequest } from "@/src/types/ServiceRequest";


export default function CreateServicePage() {

    const router = useRouter();

    const [form, setForm] = useState<ServiceRequest>({
        nom: "",
        description: ""
    });

    const [loading, setLoading] = useState(false);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

        try {

            setLoading(true);

            await createService(form);

            router.push("/admin/dashboard/services-laboratoires");

        } catch (error) {

            console.log(error);

            alert("Erreur lors de la création du service.");

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() =>
                    router.push("/admin/dashboard/services-laboratoires")
                }
            />

            <div className="relative bg-white rounded-2xl shadow-xl w-[500px] max-w-[90%] p-6">

                <div className="flex items-center justify-between mb-6">

                    <h1 className="text-xl font-semibold text-gray-800">
                        Ajouter un service
                    </h1>

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/admin/dashboard/services-laboratoires")
                        }
                        className="text-gray-400 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du service
                        </label>

                        <input
                            type="text"
                            name="nom"
                            value={form.nom}
                            onChange={handleChange}
                            required
                            placeholder="Ex : Service informatique"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Description du service..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />

                    </div>

                    <div className="flex justify-end gap-3 mt-4">

                        <button
                            type="button"
                            onClick={() =>
                                router.push("/admin/dashboard/services-laboratoires")
                            }
                            className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                        >
                            Annuler
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
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
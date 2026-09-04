"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    Building2,
    FlaskConical,
    Search,
    Plus,
    Briefcase
} from "lucide-react";

import { getServices } from "@/src/Services/serviceOrganisationnelService";
import { getLaboratoires } from "@/src/Services/laboratoireService";

import { ServiceResponse } from "@/src/types/ServiceResponse";
import { LaboratoireResponse } from "@/src/types/LaboratoireResponse";

export default function ServicesLaboratoiresPage() {

    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [laboratoires, setLaboratoires] =
        useState<LaboratoireResponse[]>([]);

    const [searchService, setSearchService] = useState("");
    const [searchLaboratoire, setSearchLaboratoire] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const [servicesData, laboratoiresData] =
                    await Promise.all([
                        getServices(),
                        getLaboratoires()
                    ]);

                setServices(servicesData);
                setLaboratoires(laboratoiresData);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, []);


    const filteredServices = services.filter((service) =>
        service.nom
            .toLowerCase()
            .includes(searchService.toLowerCase())
    );


    const filteredLaboratoires = laboratoires.filter((laboratoire) =>
        laboratoire.nom
            .toLowerCase()
            .includes(searchLaboratoire.toLowerCase())
    );


    return (

        <div className="flex flex-col gap-6">

            {/* HEADER */}

            <div className="flex items-center gap-3">

                <div className="bg-blue-100 p-3 rounded-xl">

                    <Briefcase
                        size={24}
                        className="text-blue-600"
                    />

                </div>

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">

                        Services & Laboratoires

                    </h1>

                    <p className="text-sm text-gray-500">

                        Gestion des services et laboratoires

                    </p>

                </div>


                </div>

            {loading ? (

                <div className="flex justify-center items-center py-20">

                    <p className="text-gray-500">
                        Chargement...
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">

                        <div className="p-5 border-b border-gray-100">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div className="bg-blue-100 rounded-full p-2.5">

                                        <Building2
                                            size={20}
                                            className="text-blue-700"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Services
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            {services.length} service
                                            {services.length > 1 ? "s" : ""}
                                        </p>

                                    </div>

                                </div>


                                {/* AJOUTER */}
                               <Link
                                    href="/admin/dashboard/services-laboratoires/service/create"
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Plus size={16} />
                                    Ajouter
                               </Link>
                            </div>


                            {/* RECHERCHE */}
                            <div className="relative mt-4">

                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={searchService}
                                    onChange={(e) =>
                                        setSearchService(e.target.value)
                                    }
                                    placeholder="Rechercher un service..."
                                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />

                            </div>

                        </div>


                        {/* LISTE SERVICES */}
                        <div className="p-5">

                            {filteredServices.length === 0 ? (

                                <p className="text-sm text-gray-500 text-center py-8">
                                    Aucun service trouvé.
                                </p>

                            ) : (

                                <div className="flex flex-col divide-y divide-gray-100">

                                    {filteredServices.map((service) => (

                                        <div
                                            key={service.id}
                                            className="py-4 first:pt-0 last:pb-0"
                                        >

                                            <h3 className="font-medium text-gray-800">
                                                {service.nom}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {service.description ||
                                                    "Aucune description disponible."}
                                            </p>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="p-5 border-b border-gray-100">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div className="bg-purple-100 rounded-full p-2.5">

                                        <FlaskConical
                                            size={20}
                                            className="text-purple-700"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Laboratoires
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            {laboratoires.length} laboratoire
                                            {laboratoires.length > 1 ? "s" : ""}
                                        </p>

                                    </div>

                                </div>

                            <Link
                                href="/admin/dashboard/services-laboratoires/laboratoire/create"
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors" >
                                <Plus size={16} />
                                Ajouter
                            </Link>

                            </div>
                            <div className="relative mt-4">

                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={searchLaboratoire}
                                    onChange={(e) =>
                                        setSearchLaboratoire(e.target.value)
                                    }
                                    placeholder="Rechercher un laboratoire..."
                                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />

                            </div>

                        </div>

                        <div className="p-5">

                            {filteredLaboratoires.length === 0 ? (

                                <p className="text-sm text-gray-500 text-center py-8">
                                    Aucun laboratoire trouvé.
                                </p>

                            ) : (

                                <div className="flex flex-col divide-y divide-gray-100">

                                    {filteredLaboratoires.map((laboratoire) => (

                                        <div
                                            key={laboratoire.id}
                                            className="py-4 first:pt-0 last:pb-0"
                                        >

                                            <h3 className="font-medium text-gray-800">
                                                {laboratoire.nom}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {laboratoire.description ||
                                                    "Aucune description disponible."}
                                            </p>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}
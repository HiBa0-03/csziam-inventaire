"use client";

import { FormEvent, useState ,useEffect} from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { createArticle  } from "@/src/Services/articleService";
import { ArticleRequest } from "@/src/types/ArticleRequest";
import {getServices} from "@/src/Services/serviceOrganisationnelService";
import { getLaboratoires} from "@/src/Services/laboratoireService";
import { ServiceResponse } from "@/src/types/ServiceResponse";
import { LaboratoireResponse } from "@/src/types/LaboratoireResponse";
import { CategorieResponse } from "@/src/types/CategorieResponse";
import { getCategories } from "@/src/Services/categorieService";

export default function CreateArticlesPage() {

    const router = useRouter();

    const [formData, setFormData] = useState<ArticleRequest>({
        designation: "",
        numeroInventaire: "",
        etat: "DISPONIBLE",
        dateAcquisition: "",
        valeur: 0,
        categorieId: 0,
    });

    const [typeEmplacement, setTypeEmplacement] =
        useState<"service" | "laboratoire">("service");

    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [laboratoires, setLaboratoires] = useState<LaboratoireResponse[]>([]);
    const [categories,setCategories]=useState<CategorieResponse[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
    const loadEmplacements = async () => {
        try {
            setLoadingData(true);
                    const [servicesData,laboratoiresData,categoriesData] = await Promise.all([
                getServices(),getLaboratoires(),getCategories() ]);

            setServices(servicesData);
            setLaboratoires(laboratoiresData);
            setCategories(categoriesData);
                    } catch (error) {
            console.error(
                "Erreur lors du chargement des services et laboratoires :",
                error
            );

            alert(
                    "Impossible de charger les services, laboratoires et catégories."
                );

        } finally {
            setLoadingData(false);
        }
    };

    loadEmplacements();
}, []);
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "valeur" ||
                name === "categorieId" ||
                name === "serviceId" ||
                name === "laboratoireId"
                    ? Number(value)
                    : value,
        }));

    };


    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        try {

            setLoading(true);

            const article: ArticleRequest = {
                ...formData,
            };

            await createArticle(article);

            router.push("/admin/dashboard/articles");

        } catch (error) {

            console.error(error);

            alert("Erreur lors de la création de l'article.");

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => router.push("/admin/dashboard/articles")} />

            <div className="relative z-10 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">
                            Ajouter un article
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Ajouter un nouvel article à l'inventaire
                        </p>
                    </div>

                    <button type="button"
                        onClick={() =>router.push("/admin/dashboard/articles")}
                        className="p-2 rounded-lg hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}
                    className="p-6 space-y-5">

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Désignation
                        </label>

                        <input type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Ordinateur Dell"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Numéro d'inventaire
                        </label>
                        <input type="text"
                            name="numeroInventaire"
                            value={formData.numeroInventaire}
                            onChange={handleChange}
                            required
                            placeholder="Ex: INV-2026-001"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                État
                            </label>
                            <select
                                name="etat"
                                value={formData.etat}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5">
                                <option value="">
                                    Sélectionner un état
                                </option>

                                <option value="NEUF">
                                    Neuf
                                </option>

                                <option value="DISPONIBLE">
                                    Disponible
                                </option>

                                <option value="EN_PANNE">
                                    En panne
                                </option>

                                <option value="MAINTENANCE">
                                    Maintenance
                                </option>

                                <option value="HORS_SERVICE">
                                    Hors service
                                </option>
                            </select>

                        </div>

                        <div>

                            <label className="block text-sm font-medium mb-2">
                                Date d'acquisition
                            </label>

                            <input type="date"
                                name="dateAcquisition"
                                value={formData.dateAcquisition}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5"/>

                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Valeur
                        </label>
                        <input  type="number"
                            name="valeur"
                            value={formData.valeur}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                            placeholder="Ex: 8500"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Catégorie
                        </label>

                       <select  name="categorieId"
                            value={formData.categorieId}
                            onChange={handleChange}
                            required
                            disabled={loadingData}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5">
                            <option value={0}>
                                {loadingData ? "Chargement des catégories...":"Sélectionner une catégorie"}
                            </option>

                            {categories.map((categorie) => (
                                <option key={categorie.id} value={categorie.id}>
                                    {categorie.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Emplacement
                        </label>
                        <div className="flex gap-6 mb-4">
                            <label className="flex items-center gap-2">
                                <input type="radio"
                                    checked={typeEmplacement === "service"}
                                    onChange={() => {
                                        setTypeEmplacement("service");
                                        setFormData((prev) => ({...prev,laboratoireId: undefined,
                                        }));
                                    }}/>
                                Service
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio"
                                    checked={typeEmplacement === "laboratoire"}
                                    onChange={() => {
                                        setTypeEmplacement("laboratoire");
                                        setFormData((prev) => ({...prev,serviceId: undefined,
                                        }));
                                    }} />

                                Laboratoire

                            </label>

                        </div>
                        {typeEmplacement === "service" && (
                           <select name="serviceId"
                            value={formData.serviceId ?? ""}
                            onChange={handleChange}
                            required
                            disabled={loadingData}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5">
                            <option value="">
                                {loadingData? "Chargement des services...": "Sélectionner un service"}
                            </option>

                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.nom}
                                </option>
                            ))}
                        </select>
                                                )}

                        {typeEmplacement === "laboratoire" && (
                         <select name="laboratoireId"
                            value={formData.laboratoireId ?? ""}
                            onChange={handleChange}
                            required
                            disabled={loadingData}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5">
                            <option value="">
                                {loadingData? "Chargement des laboratoires...": "Sélectionner un laboratoire"}
                            </option>
                            {laboratoires.map((laboratoire) => (
                                <option key={laboratoire.id} value={laboratoire.id}>
                                    {laboratoire.nom}
                                </option>
                            ))}
                        </select>
                        )}

                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">

                        <button
                            type="button"
                            onClick={() => router.push("/admin/dashboard/articles")}
                            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                            Annuler
                        </button>
                        <button type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" >
                            {loading ? "Création...":"Créer l'article"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}
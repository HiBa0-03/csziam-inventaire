"use client";

import { Trash2, X } from "lucide-react";

type DeleteArticleModalProps = {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function DeleteArticleModal({
    open,
    onCancel,
    onConfirm
}: DeleteArticleModalProps) {

    if (!open) {
        return null;
    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}/>
            <div className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6">
                <button onClick={onCancel} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
                        <Trash2 size={26} />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-800">
                        Supprimer cet article ?
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        Êtes-vous sûr de vouloir supprimer cet article ?
                        Cette action est irréversible.
                    </p>

                    <div className="flex gap-3 mt-6 w-full">

                        <button onClick={onCancel}
                            className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50" >
                            Annuler
                        </button>

                        <button onClick={onConfirm}
                            className="flex-1 bg-red-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-red-700" >
                            Supprimer
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}
"use client";

import Link from "next/link";
import { FolderOpen } from "lucide-react";

type CategoryCardProps = {
    total: number;
};

export default function CategoryCard({ total }: CategoryCardProps) {

    return (

        <div className="bg-white rounded-xl border shadow-sm p-4 h-[110px] flex flex-col justify-center">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="bg-blue-100 rounded-full p-2.5">
                        <FolderOpen className="text-blue-700" size={20} />
                    </div>

                    <h2 className="font-semibold text-base">
                        Catégories
                    </h2>

                </div>

                <Link
                    href="/admin/dashboard/categorie"
                    className="text-blue-600 hover:underline text-sm"
                >
                    View all →
                </Link>

            </div>

            <p className="text-3xl font-bold mt-2">
                {total}
            </p>

        </div>

    );

}
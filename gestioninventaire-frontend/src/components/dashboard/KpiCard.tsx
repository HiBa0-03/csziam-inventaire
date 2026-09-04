"use client";

import { ClipboardCheck } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: string;
  sublabel?: string;
};

export default function KpiCard({ label, value, sublabel }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 h-[110px] flex flex-col justify-center">

      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 rounded-full p-2.5">
          <ClipboardCheck size={18} className="text-emerald-700" />
        </div>
        <h2 className="font-semibold text-base">
          {label}
        </h2>
      </div>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

      {sublabel && (
        <p className="text-xs text-gray-500 mt-0.5">
          {sublabel}
        </p>
      )}

    </div>
  );
}
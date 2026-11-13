"use client";

import { FaGraduationCap } from "react-icons/fa";
import GlassCard from "@/components/ui/GlassCard";

export default function AcademicOverview({ profile }) {
  return (
    <GlassCard>
      {/* Header */}
      <div className="mb-7 flex items-center gap-3">
        <div
          className="
            flex h-11 w-11 items-center justify-center
            rounded-xl
            border border-[#C97B3C]/20
            bg-[#C97B3C]/10
            text-[#F4C27A]
          "
        >
          <FaGraduationCap />
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#C97B3C]">
            ACADEMICS
          </p>

          <h2 className="text-2xl font-bold text-white">Academic Overview</h2>
        </div>
      </div>

      {/* Academic Information */}
      <div className="grid gap-6 sm:grid-cols-2">
        <AcademicItem label="College" value={profile?.college} />

        <AcademicItem label="Branch" value={profile?.branch} />

        <AcademicItem label="Semester" value={profile?.semester} />

        <AcademicItem label="CGPA" value={profile?.cgpa} highlight />
      </div>
    </GlassCard>
  );
}

function AcademicItem({ label, value, highlight = false }) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-500">{label}</p>

      <p
        className={`font-semibold ${
          highlight ? "text-[#F4C27A]" : "text-gray-200"
        }`}
      >
        {value || "Not added"}
      </p>
    </div>
  );
}

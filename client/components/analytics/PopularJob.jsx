"use client";

import {
  FaFire,
  FaUsers,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";

export default function PopularJob({ job }) {
  if (!job) {
    return (
      <GlassCard>
        <SectionHeader
          title="Most Popular Job"
          subtitle="The job attracting the highest number of applications."
        />

        <div className="flex h-60 items-center justify-center text-gray-500">
          No job data available.
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <SectionHeader
        title="Most Popular Job"
        subtitle="Highest engagement among all your posted jobs."
      />

      <div className="space-y-6">
        {/* Header */}

        <div className="flex items-center gap-5">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-[#C97B3C]/20
              bg-gradient-to-br
              from-[#C97B3C]/20
              to-[#F4C27A]/10
            "
          >
            <FaFire className="text-[#F4C27A]" size={28} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{job.title}</h2>

            <p className="mt-1 text-gray-400">{job.company}</p>
          </div>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-[#C97B3C]">
              <FaUsers />

              <span className="text-sm text-gray-400">Applicants</span>
            </div>

            <h3 className="mt-2 text-2xl font-bold text-white">
              {job.applicants || 0}
            </h3>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-[#C97B3C]">
              <FaMoneyBillWave />

              <span className="text-sm text-gray-400">Package</span>
            </div>

            <h3 className="mt-2 text-2xl font-bold text-white">
              ₹ {job.package || 0} LPA
            </h3>
          </div>
        </div>

        {/* Location */}

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-[#C97B3C]/15
            bg-[#C97B3C]/10
            p-4
          "
        >
          <FaMapMarkerAlt className="text-[#F4C27A]" />

          <span className="text-gray-300">{job.location}</span>
        </div>
      </div>
    </GlassCard>
  );
}

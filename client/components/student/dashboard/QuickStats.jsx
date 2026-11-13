"use client";

import { FaBriefcase, FaCheckCircle, FaStar, FaCode } from "react-icons/fa";

import StatCard from "@/components/ui/StatCard";

export default function QuickStats({ dashboard }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {/* Applications */}

      <StatCard
        title="Applications"
        value={dashboard.stats.totalApplications}
        subtitle="Jobs Applied"
        icon={<FaBriefcase />}
        color="text-[#F4C27A]"
      />

      {/* Shortlisted */}

      <StatCard
        title="Shortlisted"
        value={dashboard.stats.shortlisted}
        subtitle="Interview Ready"
        icon={<FaStar />}
        color="text-[#F4C27A]"
      />

      {/* Selected */}

      <StatCard
        title="Selected"
        value={dashboard.stats.selected}
        subtitle="Offers Received"
        icon={<FaCheckCircle />}
        color="text-[#F4C27A]"
      />

      {/* Skills */}

      <StatCard
        title="Skills"
        value={dashboard.stats.totalSkills}
        subtitle="Technical Skills"
        icon={<FaCode />}
        color="text-[#F4C27A]"
      />
    </div>
  );
}

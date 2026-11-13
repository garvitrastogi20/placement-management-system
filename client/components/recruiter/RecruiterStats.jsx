"use client";

import {
  FaBriefcase,
  FaClipboardList,
  FaUsers,
  FaUserCheck,
} from "react-icons/fa";

import StatCard from "@/components/ui/StatCard";

export default function RecruiterStats({ stats }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Jobs"
        value={stats?.totalJobs || 0}
        subtitle="All job postings"
        icon={<FaBriefcase />}
        color="text-[#C97B3C]"
      />

      <StatCard
        title="Active Jobs"
        value={stats?.activeJobs || 0}
        subtitle="Currently accepting applications"
        icon={<FaClipboardList />}
        color="text-green-400"
      />

      <StatCard
        title="Applicants"
        value={stats?.totalApplicants || 0}
        subtitle="Across all jobs"
        icon={<FaUsers />}
        color="text-[#F4C27A]"
      />

      <StatCard
        title="Shortlisted"
        value={stats?.shortlisted || 0}
        subtitle="Ready for interviews"
        icon={<FaUserCheck />}
        color="text-cyan-400"
      />
    </div>
  );
}

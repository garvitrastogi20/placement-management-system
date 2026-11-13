"use client";

import {
  FaBriefcase,
  FaUsers,
  FaClipboardCheck,
  FaChartLine,
} from "react-icons/fa";

import StatCard from "@/components/ui/StatCard";

export default function AnalyticsStats({ stats }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Jobs"
        value={stats.totalJobs}
        icon={<FaBriefcase />}
        color="from-[#C97B3C] to-[#F4C27A]"
        subtitle="Published Jobs"
      />

      <StatCard
        title="Active Jobs"
        value={stats.activeJobs}
        icon={<FaClipboardCheck />}
        color="from-green-500 to-emerald-400"
        subtitle="Currently Hiring"
      />

      <StatCard
        title="Applications"
        value={stats.totalApplications}
        icon={<FaUsers />}
        color="from-orange-500 to-yellow-400"
        subtitle="Received"
      />

      <StatCard
        title="Avg / Job"
        value={stats.averageApplicants}
        icon={<FaChartLine />}
        color="from-pink-500 to-red-400"
        subtitle="Applicants"
      />
    </div>
  );
}

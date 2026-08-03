"use client";

import {
  FaBriefcase,
  FaClipboardList,
  FaUsers,
  FaUserCheck,
} from "react-icons/fa";

import StatCard from "./StatCard";

export default function RecruiterStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Jobs"
        value={stats?.totalJobs || 0}
        icon={<FaBriefcase />}
        color="from-blue-500 to-cyan-500"
      />

      <StatCard
        title="Active Jobs"
        value={stats?.activeJobs || 0}
        icon={<FaClipboardList />}
        color="from-green-500 to-emerald-500"
      />

      <StatCard
        title="Applicants"
        value={stats?.totalApplicants || 0}
        icon={<FaUsers />}
        color="from-purple-500 to-pink-500"
      />

      <StatCard
        title="Shortlisted"
        value={stats?.shortlisted || 0}
        icon={<FaUserCheck />}
        color="from-orange-500 to-red-500"
      />
    </div>
  );
}
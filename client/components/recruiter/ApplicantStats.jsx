"use client";

import {
  FaUsers,
  FaClipboardCheck,
  FaUserCheck,
  FaCheckCircle,
} from "react-icons/fa";

import StatCard from "@/components/ui/StatCard";

export default function ApplicantStats({ stats }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Applicants"
        value={stats?.totalApplicants || 0}
        icon={<FaUsers />}
        color="text-[#C97B3C]"
        subtitle="All Applications"
      />

      <StatCard
        title="Applied"
        value={stats?.applied || 0}
        icon={<FaClipboardCheck />}
        color="text-blue-400"
        subtitle="Waiting for Review"
      />

      <StatCard
        title="Shortlisted"
        value={stats?.shortlisted || 0}
        icon={<FaUserCheck />}
        color="text-yellow-400"
        subtitle="Qualified Candidates"
      />

      <StatCard
        title="Selected"
        value={stats?.selected || 0}
        icon={<FaCheckCircle />}
        color="text-green-400"
        subtitle="Successfully Hired"
      />
    </div>
  );
}

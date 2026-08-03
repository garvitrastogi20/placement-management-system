"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

import RecruiterStats from "@/components/recruiter/RecruiterStats";
import RecentJobs from "@/components/recruiter/RecentJobs";
import RecentApplications from "@/components/recruiter/RecentApplications";
import QuickActions from "@/components/recruiter/QuickActions";
import { getDashboard } from "@/services/recruiterService";

export default function RecruiterDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
        <h2 className="text-xl font-semibold text-red-400">{error}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">Welcome Back 👋</h1>

          <p className="mt-2 text-gray-400">
            Here's an overview of your recruitment activity.
          </p>
        </div>

        <Link
          href="/recruiter/create-job"
          className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white transition hover:scale-105"
        >
          <FaPlus />
          Create Job
        </Link>
      </div>

      {/* Stats */}
      <RecruiterStats stats={dashboard?.stats} />

      {/* Recent Jobs */}
      <RecentJobs jobs={dashboard?.recentJobs} />

      {/* Upcoming Sections */}
      <div className="grid gap-8 lg:grid-cols-2">
        <RecentApplications applications={dashboard?.recentApplications} />

       <QuickActions />
      </div>
    </div>
  );
}

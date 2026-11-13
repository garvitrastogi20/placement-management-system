"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import HeroBanner from "@/components/ui/HeroBanner";
import GlassCard from "@/components/ui/GlassCard";

import RecruiterStats from "@/components/recruiter/RecruiterStats";
import RecentJobs from "@/components/recruiter/RecentJobs";
import RecentApplications from "@/components/recruiter/RecentApplications";
import QuickActions from "@/components/recruiter/QuickActions";

import { getDashboard } from "@/services/recruiterService";

export default function RecruiterDashboard() {
  const router = useRouter();

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
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#C97B3C] border-t-transparent"></div>

          <p className="text-lg text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
        <h2 className="text-xl font-semibold text-red-400">{error}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero */}

      <HeroBanner
        title="Recruit Smarter with AI"
        subtitle="Manage jobs, monitor applications, shortlist top candidates and streamline your recruitment process with PlaceMentor AI."
        buttonText="+ Create Job"
        onClick={() => router.push("/recruiter/create-job")}
      />

      {/* Stats */}

      <GlassCard>
        <RecruiterStats stats={dashboard?.stats} />
      </GlassCard>

      {/* Recent Jobs */}

      <RecentJobs jobs={dashboard?.recentJobs} />

      {/* Bottom Grid */}

      <div className="grid gap-8 lg:grid-cols-2">
        <RecentApplications applications={dashboard?.recentApplications} />

        <QuickActions />
      </div>
    </div>
  );
}

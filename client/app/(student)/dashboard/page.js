"use client";

import PageContainer from "@/components/layout/PageContainer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Hero from "@/components/student/dashboard/Hero";
import QuickStats from "@/components/student/dashboard/QuickStats";
import ProfileCompletion from "@/components/student/dashboard/ProfileCompletion";
import AcademicOverview from "@/components/student/dashboard/AcademicOverview";
import SkillsCard from "@/components/student/dashboard/SkillsCard";
import ResumeCard from "@/components/student/dashboard/ResumeCard";
import RecentActivity from "@/components/student/dashboard/RecentActivity";
import RecommendedJobs from "@/components/student/dashboard/RecommendedJobs";
import ActivityTimeline from "@/components/student/dashboard/ActivityTimeline";
import ResumeAnalysisCard from "@/components/student/dashboard/ResumeAnalysisCard";
import api from "@/services/api";

export default function Dashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Fetch Dashboard
  // ==========================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const res = await api.get("/student/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(res.data);
      } catch (error) {
        console.error("Dashboard Error:", error);

        if (error.response?.status === 401) {
          router.push("/login");
          return;
        }

        if (error.response?.status === 404) {
          router.push("/profile");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  // ==========================================
  // Profile Completion
  // ==========================================

  const profileCompletion = useMemo(() => {
    if (!dashboard?.profile) {
      return 0;
    }

    const profile = dashboard.profile;

    const fields = [
      profile.phone,
      profile.college,
      profile.branch,
      profile.semester,
      profile.cgpa,
      profile.skills?.length > 0,
      profile.linkedin,
      profile.github,
      profile.portfolio,
      profile.bio,
      profile.resume?.url,
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round((completed / fields.length) * 100);
  }, [dashboard]);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090807] text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#C97B3C]/20 border-t-[#F4C27A]" />

          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // No Dashboard
  // ==========================================

  if (!dashboard) {
    return null;
  }

  // ==========================================
  // Dashboard
  // ==========================================

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* ====================================== */}
        {/* HERO */}
        {/* ====================================== */}

        <Hero
          profile={{
            ...dashboard.profile,
            user: dashboard.user,
          }}
        />

        {/* ====================================== */}
        {/* QUICK STATS */}
        {/* ====================================== */}

        <QuickStats dashboard={dashboard} />

        {/* ====================================== */}
        {/* PROFILE COMPLETION */}
        {/* ====================================== */}

        <ProfileCompletion
          profile={dashboard.profile}
          completion={profileCompletion}
        />

        {/* ====================================== */}
        {/* ACADEMIC + SKILLS */}
        {/* ====================================== */}

        <div className="grid gap-8 lg:grid-cols-2">
          <AcademicOverview profile={dashboard.profile} />

          <SkillsCard profile={dashboard.profile} />
        </div>

        {/* ====================================== */}
        {/* RESUME */}
        {/* ====================================== */}

        <ResumeCard profile={dashboard.profile} />

        {/* LATEST RESUME ANALYSIS */}
        <ResumeAnalysisCard />

        {/* ====================================== */}
        {/* RECOMMENDED JOBS */}
        {/* ====================================== */}

        <RecommendedJobs jobs={dashboard.recommendedJobs || []} />

        {/* ====================================== */}
        {/* RECENT ACTIVITY + TIMELINE */}
        {/* ====================================== */}

        <div className="grid gap-8 lg:grid-cols-2">
          <RecentActivity applications={dashboard.recentApplications || []} />

          <ActivityTimeline applications={dashboard.recentApplications || []} />
        </div>
      </div>
    </PageContainer>
  );
}

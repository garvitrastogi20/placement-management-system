"use client";

import { useCallback, useEffect, useState } from "react";

import PageContainer from "@/components/ui/PageContainer";
import HeroBanner from "@/components/ui/HeroBanner";
import EmptyState from "@/components/ui/EmptyState";

import AnalyticsStats from "@/components/analytics/AnalyticsStats";
import MonthlyChart from "@/components/analytics/MonthlyChart";
import StatusChart from "@/components/analytics/StatusChart";
import TopSkills from "@/components/analytics/TopSkills";
import PopularJob from "@/components/analytics/PopularJob";

import { getRecruiterAnalytics } from "@/services/analyticsService";

export default function RecruiterAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await getRecruiterAnalytics();

      setAnalytics(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <div
              className="
                                mx-auto
                                mb-5
                                h-12
                                w-12
                                animate-spin
                                rounded-full
                                border-4
                                border-[#C97B3C]
                                border-t-transparent
                            "
            />

            <p className="text-lg text-gray-400">Loading Analytics...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!analytics) {
    return (
      <PageContainer>
        <EmptyState
          title="Analytics unavailable"
          subtitle="Unable to load recruiter analytics."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-10">
        <HeroBanner
          title="Recruitment Analytics"
          subtitle="Track hiring trends, monitor applications and understand recruitment performance with real-time insights."
          buttonText="Refresh"
          onClick={fetchAnalytics}
        />

        <AnalyticsStats stats={analytics.stats} />
        <div className="grid gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <MonthlyChart data={analytics.monthlyApplications} />
          </div>

          <StatusChart stats={analytics.stats} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <TopSkills skills={analytics.topSkills} />

          <PopularJob job={analytics.mostPopularJob} />
        </div>
      </div>
    </PageContainer>
  );
}

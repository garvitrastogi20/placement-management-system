"use client";

import JobCard from "./JobCard";

import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";

export default function RecentJobs({ jobs }) {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Recent Jobs"
        subtitle="Recently published job opportunities."
      />

      {!jobs || jobs.length === 0 ? (
        <EmptyState
          title="No Jobs Yet"
          subtitle="Create your first job posting to start hiring candidates."
        />
      ) : (
        <GlassCard>
          <div className="grid gap-6 lg:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </GlassCard>
      )}
    </section>
  );
}

"use client";

import ApplicantsTable from "./ApplicantsTable";

import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function RecentApplications({ applications }) {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Recent Applications"
        subtitle="Latest candidates who have applied."
      />

      {!applications || applications.length === 0 ? (
        <EmptyState
          title="No Applications Yet"
          subtitle="Applications will appear here once students start applying."
        />
      ) : (
        <GlassCard>
          <ApplicantsTable applications={applications} />
        </GlassCard>
      )}
    </section>
  );
}

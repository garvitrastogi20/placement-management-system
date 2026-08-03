"use client";

import ApplicantsTable from "./ApplicantsTable";

export default function RecentApplications({
  applications,
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Recent Applications
        </h2>
      </div>

      <ApplicantsTable
        applications={applications}
      />
    </section>
  );
}
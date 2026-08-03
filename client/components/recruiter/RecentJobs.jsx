"use client";

import JobCard from "./JobCard";

export default function RecentJobs({ jobs }) {
  return (
    <section className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Recent Jobs
        </h2>
      </div>

      {jobs?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-700 p-12 text-center">
          <p className="text-gray-400">
            No jobs posted yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {jobs?.map((job) => (
            <JobCard
              key={job._id}
              job={job}
            />
          ))}
        </div>
      )}

    </section>
  );
}
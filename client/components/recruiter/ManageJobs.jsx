"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ManageJobCard from "./ManageJobCard";

export default function ManageJobs({ jobs }) {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobs, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none"
        />

        <button
          onClick={() => router.push("/recruiter/create-job")}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          + Create Job
        </button>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-600 p-10 text-center text-gray-400">
          No jobs found.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredJobs.map((job) => (
            <ManageJobCard
              key={job._id}
              job={job}
              onApplicants={() =>
                router.push(`/recruiter/applicants?job=${job._id}`)
              }
              onEdit={() =>
                router.push(`/recruiter/create-job?edit=${job._id}`)
              }
              onDelete={() =>
                console.log("Delete:", job._id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
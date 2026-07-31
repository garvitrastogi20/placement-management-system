"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/jobs/recruiter", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8 text-white">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Manage Jobs</h1>
          <p className="mt-2 text-gray-400">
            View and manage all jobs posted by your company.
          </p>
        </div>

        <Link
          href="/recruiter/create-job"
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-700"
        >
          + Create Job
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center text-gray-400">
          Loading jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-700 p-12 text-center">
          <h2 className="text-2xl font-semibold">
            No Jobs Posted Yet
          </h2>

          <p className="mt-3 text-gray-400">
            Start by creating your first job posting.
          </p>

          <Link
            href="/recruiter/create-job"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 hover:bg-blue-700"
          >
            Create Job
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-blue-500"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {job.title}
                  </h2>

                  <p className="mt-2 text-gray-400">
                    {job.company}
                  </p>

                  <p className="mt-2">
                    📍 {job.location}
                  </p>

                  <p className="mt-2 text-green-400 font-semibold">
                    ₹ {job.package?.toLocaleString()}
                  </p>

                  <p className="mt-3 text-sm text-blue-400">
                    👥 {job.applicantCount} Applicants
                  </p>
                </div>

                <span className="rounded-full bg-green-600/20 px-4 py-2 text-sm text-green-400">
                  Active
                </span>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/recruiter/jobs/${job._id}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
                >
                  View Applicants
                </Link>

                <button className="rounded-lg border border-yellow-500 px-4 py-2 text-yellow-400 hover:bg-yellow-500 hover:text-black">
                  Edit
                </button>

                <button className="rounded-lg border border-red-500 px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
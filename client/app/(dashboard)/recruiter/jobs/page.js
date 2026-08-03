"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/services/api";

import DeleteJobModal from "@/components/recruiter/DeleteJobModal";
import { deleteJob } from "@/services/recruiterService";

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/recruiter/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await deleteJob(selectedJob._id);

      setJobs((prev) => prev.filter((job) => job._id !== selectedJob._id));

      setShowDeleteModal(false);
      setSelectedJob(null);

      alert("Job deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete job.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = search.toLowerCase();

      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      );
    });
  }, [jobs, search]);

  return (
    <div className="min-h-screen bg-gray-950 p-8 text-white">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
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

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by title, company or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center text-gray-400">Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-700 p-12 text-center">
          <h2 className="text-2xl font-semibold">No Jobs Found</h2>

          <p className="mt-3 text-gray-400">
            Try another search or create a new job.
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
          {filteredJobs.map((job) => {
            const isActive =
              !job.deadline || new Date(job.deadline) >= new Date();

            return (
              <div
                key={job._id}
                className="rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-blue-500"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{job.title}</h2>

                    <p className="mt-2 text-gray-400">{job.company}</p>

                    <p className="mt-2">📍 {job.location}</p>

                    <p className="mt-2 font-semibold text-green-400">
                      ₹ {job.package?.toLocaleString()} LPA
                    </p>

                    <p className="mt-3 text-sm text-blue-400">
                      👥 {job.applicantCount} Applicants
                    </p>

                    {job.deadline && (
                      <p className="mt-2 text-sm text-gray-500">
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm ${
                      isActive
                        ? "bg-green-600/20 text-green-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    {isActive ? "Active" : "Expired"}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/recruiter/jobs/${job._id}/applicants`}
                    className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
                  >
                    View Applicants
                  </Link>

                  <Link
                    href={`/recruiter/jobs/${job._id}/edit`}
                    className="rounded-lg border border-yellow-500 px-4 py-2 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowDeleteModal(true);
                    }}
                    className="rounded-lg border border-red-500 px-4 py-2 text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <DeleteJobModal
        isOpen={showDeleteModal}
        loading={deleteLoading}
        jobTitle={selectedJob?.title}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedJob(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

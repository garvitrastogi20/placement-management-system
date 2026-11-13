"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PageContainer from "@/components/layout/PageContainer";
import JobCard from "@/components/jobs/JobCard";
import api from "@/services/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState("");

  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Reset to page 1 whenever filters change
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res = await api.get("/jobs", {
          params: {
            page,
            limit: 10,
            company: companyFilter || undefined,
            location: locationFilter || undefined,
            skill: skillFilter || undefined,
          },
        });

        const jobsList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        setJobs(jobsList);

        if (res.data?.pagination) {
          setPagination(res.data.pagination);
        }
      } catch (error) {
        console.error("Fetch Jobs Error:", error);
        toast.error(error.response?.data?.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, companyFilter, locationFilter, skillFilter]);

  const handleApply = async (job) => {
    const jobId = job?._id;
    if (!jobId || job.isApplied) return;

    try {
      setApplyingJobId(jobId);

      const res = await api.post(`/jobs/${jobId}/apply`);

      toast.success(res.data?.message || "Application Submitted");

      setJobs((previousJobs) =>
        previousJobs.map((currentJob) =>
          currentJob._id === jobId
            ? {
                ...currentJob,
                isApplied: true,
              }
            : currentJob,
        ),
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to apply for this job.",
      );
    } finally {
      setApplyingJobId("");
    }
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-[#C97B3C]">
            OPPORTUNITIES
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Available Jobs
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-gray-400">
            Explore verified campus openings, filter by skills, and apply directly with your AI-reviewed resume.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Search title/company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-400 dark:focus:border-[#C97B3C] dark:focus:ring-[#C97B3C]/20"
          />

          <input
            type="text"
            placeholder="Filter Company"
            value={companyFilter}
            onChange={handleFilterChange(setCompanyFilter)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-400 dark:focus:border-[#C97B3C] dark:focus:ring-[#C97B3C]/20"
          />

          <input
            type="text"
            placeholder="Filter Location"
            value={locationFilter}
            onChange={handleFilterChange(setLocationFilter)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-400 dark:focus:border-[#C97B3C] dark:focus:ring-[#C97B3C]/20"
          />

          <input
            type="text"
            placeholder="Filter Skill"
            value={skillFilter}
            onChange={handleFilterChange(setSkillFilter)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-400 dark:focus:border-[#C97B3C] dark:focus:ring-[#C97B3C]/20"
          />
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-lg text-gray-400">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">
              No Jobs Available
            </h2>

            <p className="mt-3 text-gray-400">
              Check back later for new opportunities.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobs
                .filter((job) => {
                  const query = search.toLowerCase();

                  return (
                    job.title.toLowerCase().includes(query) ||
                    job.company.toLowerCase().includes(query)
                  );
                })
                .map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onApply={handleApply}
                    applying={applyingJobId === job._id}
                  />
                ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-6 sm:flex-row">
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  Showing page <span className="font-semibold text-slate-900 dark:text-white">{pagination.currentPage}</span> of{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">{pagination.totalPages}</span> ({pagination.totalRecords} total jobs)
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrevPage || loading}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Previous
                  </button>

                  <span className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNextPage || loading}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}

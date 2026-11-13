"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import PageContainer from "@/components/layout/PageContainer";
import toast from "react-hot-toast";
import { FaBuilding, FaMapMarkerAlt, FaRupeeSign, FaCalendarAlt, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const fetchJob = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJob(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load job.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id, fetchJob]);

  const handleApply = async () => {
    try {
      setApplying(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        `/jobs/${job._id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Application submitted successfully!");

      setJob((prev) => ({
        ...prev,
        isApplied: true,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Application Failed");
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-600 dark:border-[#C97B3C]/20 dark:border-t-[#F4C27A]" />
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Loading position details...</p>
          </div>
        </div>
      </PageContainer>
    );

  if (!job)
    return (
      <PageContainer>
        <div className="mx-auto max-w-xl rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500">Position Not Found</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
            This job listing may have expired or been removed by the recruiter.
          </p>
          <button
            onClick={() => router.push("/jobs")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Return to Job Listings
          </button>
        </div>
      </PageContainer>
    );

  return (
    <PageContainer>
      <div className="mx-auto max-w-4xl py-2 space-y-6">
        <button
          onClick={() => router.push("/jobs")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#F4C27A] transition"
        >
          <FaArrowLeft size={12} />
          Back to all jobs
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#11100F] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                <FaBuilding size={11} /> {job.company}
              </span>
              <h1 className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {job.title}
              </h1>
            </div>

            {job.isApplied && (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <FaCheckCircle /> Applied
              </span>
            )}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/5 dark:bg-white/[0.03]">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-gray-400">
                <FaMapMarkerAlt className="text-blue-600 dark:text-[#C97B3C]" /> Location
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{job.location || "Remote / Unspecified"}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/5 dark:bg-white/[0.03]">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-gray-400">
                <FaRupeeSign className="text-blue-600 dark:text-[#C97B3C]" /> Package
              </p>
              <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                ₹ {job.package ? job.package.toLocaleString("en-IN") : "Not disclosed"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/5 dark:bg-white/[0.03]">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-gray-400">
                <FaCalendarAlt className="text-blue-600 dark:text-[#C97B3C]" /> Application Deadline
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN") : "Rolling basis"}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-8 dark:border-white/10">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Role Overview</h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-gray-300 text-sm sm:text-base whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {Array.isArray(job.skillsRequired) && job.skillsRequired.length > 0 && (
            <div className="mt-8 border-t border-slate-200 pt-8 dark:border-white/10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Required Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.recruiter && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/[0.02]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Posted by Recruiter
              </h3>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{job.recruiter.name}</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">{job.recruiter.email}</p>
            </div>
          )}

          <div className="mt-8 pt-4">
            <button
              onClick={handleApply}
              disabled={job.isApplied || applying}
              className={`w-full rounded-2xl py-4 font-semibold text-white shadow-md transition ${
                job.isApplied
                  ? "cursor-not-allowed bg-emerald-600 opacity-90"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60"
              }`}
            >
              {applying ? "Submitting Application..." : job.isApplied ? "✓ Application Submitted" : "Apply for Position"}
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
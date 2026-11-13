"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";

const STATUS_STYLES = {
  applied: "bg-amber-500/15 text-amber-300",
  shortlisted: "bg-blue-500/15 text-blue-300",
  selected: "bg-emerald-500/15 text-emerald-300",
  rejected: "bg-red-500/15 text-red-300",
};

function StatCard({ label, value, description, icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 dark:border-white/10 dark:bg-[#11100f] dark:hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-gray-400">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StudentAnalyticsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchApplications() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your application analytics.");
        }

        const response = await api.get("/jobs/my-applications", {
          params: { limit: 50 },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.applications)
            ? data.applications
            : Array.isArray(data?.data)
              ? data.data
              : [];

        if (active) {
          setApplications(list);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load application analytics.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchApplications();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const getStatus = (application) =>
    String(application.status || "Applied")
      .trim()
      .toLowerCase();

  const countStatus = (...statuses) =>
    applications.filter((application) =>
      statuses.includes(getStatus(application)),
    ).length;

  const total = applications.length;
  const applied = countStatus("applied");
  const shortlisted = countStatus("shortlisted");
  const selected = countStatus("selected");
  const rejected = countStatus("rejected");

  const stats = [
    {
      label: "Total Applications",
      value: total,
      description: "Jobs you have applied for",
      icon: "▤",
      color: "bg-blue-500/15 text-blue-300",
    },
    {
      label: "Shortlisted",
      value: shortlisted,
      description: "Applications shortlisted",
      icon: "✦",
      color: "bg-purple-500/15 text-purple-300",
    },
    {
      label: "Applied",
      value: applied,
      description: "Awaiting recruiter review",
      icon: "◷",
      color: "bg-amber-500/15 text-amber-300",
    },
    {
      label: "Selected",
      value: selected,
      description: "Successful outcomes",
      icon: "✓",
      color: "bg-emerald-500/15 text-emerald-300",
    },
  ];

  const statusRows = [
    {
      label: "Applied",
      count: applied,
      color: "bg-amber-400",
    },
    {
      label: "Shortlisted",
      count: shortlisted,
      color: "bg-blue-400",
    },
    {
      label: "Selected",
      count: selected,
      color: "bg-emerald-400",
    },
    {
      label: "Rejected",
      count: rejected,
      color: "bg-red-400",
    },
  ];

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.appliedAt || 0).getTime() -
        new Date(a.createdAt || a.appliedAt || 0).getTime(),
    )
    .slice(0, 5);

  const shortlistRate = total ? Math.round((shortlisted / total) * 100) : 0;

  const selectionRate = total ? Math.round((selected / total) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-amber-400">
            STUDENT PORTAL / ANALYTICS
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Application Analytics
          </h1>

          <p className="mt-2 text-gray-400">
            Track your placement journey and application progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((previous) => previous + 1)}
          disabled={loading}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "↻ Refresh data"}
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#11100f] p-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber-400" />

          <p className="text-gray-400">Loading your analytics...</p>
        </div>
      ) : error ? (
        /* Error state */
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <h2 className="font-semibold text-red-300">
            Could not load analytics
          </h2>

          <p className="mt-2 text-sm text-gray-400">{error}</p>

          <button
            type="button"
            onClick={() => setRefreshKey((previous) => previous + 1)}
            className="mt-5 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* Statistics cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Status breakdown and placement overview */}
          <div className="mt-6 grid gap-6 xl:grid-cols-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#11100f] xl:col-span-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Application Status
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Breakdown of your current applications.
              </p>

              {total === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 dark:border-white/10 p-8 text-center">
                  <div className="text-3xl">▤</div>

                  <p className="mt-3 font-medium text-slate-900 dark:text-white">
                    No applications yet
                  </p>

                  <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                    Apply for jobs to start tracking your progress here.
                  </p>

                  <Link
                    href="/jobs"
                    className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Explore jobs
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {statusRows.map((row) => {
                    const percentage = Math.round((row.count / total) * 100);

                    return (
                      <div key={row.label}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-700 dark:text-gray-300">{row.label}</span>

                          <span className="text-slate-500 dark:text-gray-400">
                            {row.count} ({percentage}%)
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${row.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#11100f] xl:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Placement Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Your current placement progress.
              </p>

              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-transparent dark:bg-white/[0.03]">
                <p className="text-sm text-slate-600 dark:text-gray-400">Shortlist rate</p>

                <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-300">
                  {shortlistRate}%
                </p>

                <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">
                  Percentage of applications shortlisted.
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-transparent dark:bg-white/[0.03]">
                <p className="text-sm text-slate-600 dark:text-gray-400">Selection rate</p>

                <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-300">
                  {selectionRate}%
                </p>

                <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">
                  Percentage of applications resulting in selection.
                </p>
              </div>

              <Link
                href="/my-applications"
                className="mt-5 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
              >
                View all applications →
              </Link>
            </section>
          </div>

          {/* Recent applications */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#11100f]">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-6 dark:border-white/10">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Applications
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  Your latest application activity.
                </p>
              </div>

              <Link
                href="/my-applications"
                className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                View all
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  Your recent applications will appear here.
                </p>

                <Link
                  href="/jobs"
                  className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Browse available jobs →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {recentApplications.map((application, index) => {
                  const job = application.job || {};
                  const status = getStatus(application);

                  const statusLabel =
                    status.charAt(0).toUpperCase() + status.slice(1);

                  const appliedDate =
                    application.createdAt || application.appliedAt;

                  return (
                    <div
                      key={application._id || index}
                      className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {job.title || "Job application"}
                        </p>

                        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
                          {job.company || "Company not available"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                          {appliedDate
                            ? new Date(appliedDate).toLocaleDateString("en-IN")
                            : "Date unavailable"}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          STATUS_STYLES[status] || "bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-gray-300"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import PageContainer from "@/components/layout/PageContainer";
import api from "@/services/api";

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
    });

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await api.get("/jobs/my-applications", {
                    params: {
                        page,
                        limit: 10,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const list = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                      ? res.data.data
                      : [];

                setApplications(list);

                if (res.data?.pagination) {
                    setPagination(res.data.pagination);
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                        "Failed to load applications."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [page]);

    const getStatusColor = (status) => {
        switch (status) {
            case "Selected":
                return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";

            case "Shortlisted":
                return "border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400";

            case "Rejected":
                return "border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400";

            case "Under Review":
                return "border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400";

            default:
                return "border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";
        }
    };

    return (
        <PageContainer>
            <div className="space-y-8">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-[#C97B3C]">
                        PORTAL / APPLICATIONS
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                        My Applications
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-gray-400">
                        Track your application progress, status updates, and hiring pipeline across all jobs.
                    </p>
                </div>

                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-lg text-slate-500 dark:text-gray-400">
                            Loading applications...
                        </p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/5 backdrop-blur-lg">
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                            No Applications Found
                        </h2>

                        <p className="mt-3 text-slate-600 dark:text-gray-400">
                            You haven&apos;t applied for any jobs yet.
                        </p>

                        <Link
                            href="/jobs"
                            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 shadow-md"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <>
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div
                                key={app._id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-lg transition hover:border-blue-500/40 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500/40 dark:hover:shadow-xl"
                            >
                                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                                    <div>

                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {app.job?.title}
                                        </h2>

                                        <p className="mt-2 text-slate-600 dark:text-gray-400">
                                            {app.job?.company}
                                        </p>

                                        <p className="mt-1 text-slate-500 dark:text-gray-500">
                                            📍 {app.job?.location}
                                        </p>

                                        <p className="mt-3 text-lg font-semibold text-emerald-600 dark:text-green-400">
                                            ₹{" "}
                                            {app.job?.package?.toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                        <p className="mt-3 text-sm text-slate-500 dark:text-gray-400">
                                            Applied on{" "}
                                            {new Date(
                                                app.createdAt
                                            ).toLocaleDateString("en-IN")}
                                        </p>

                                        {app.job?.deadline && (
                                            <p className="mt-1 text-sm text-slate-400 dark:text-gray-500">
                                                Deadline:{" "}
                                                {new Date(
                                                    app.job.deadline
                                                ).toLocaleDateString("en-IN")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-start md:items-end gap-4">

                                        <span
                                            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${getStatusColor(
                                                app.status
                                            )}`}
                                        >
                                            {app.status}
                                        </span>

                                        <Link
                                            href={`/jobs/${app.job?._id}`}
                                            className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 shadow-sm"
                                        >
                                            View Job
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-6 sm:flex-row">
                            <p className="text-sm text-slate-600 dark:text-gray-400">
                                Showing page <span className="font-semibold text-slate-900 dark:text-white">{pagination.currentPage}</span> of{" "}
                                <span className="font-semibold text-slate-900 dark:text-white">{pagination.totalPages}</span> ({pagination.totalRecords} total applications)
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
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/Navbar";
import api from "@/services/api";

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await api.get("/jobs/my-applications", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setApplications(res.data);
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
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Selected":
                return "bg-green-900 text-green-300";

            case "Shortlisted":
                return "bg-blue-900 text-blue-300";

            case "Rejected":
                return "bg-red-900 text-red-300";

            case "Under Review":
                return "bg-indigo-900 text-indigo-300";

            default:
                return "bg-yellow-900 text-yellow-300";
        }
    };

    return (
        <PageContainer>
            <Navbar />

            <div className="mt-8">
                <h1 className="mb-8 text-4xl font-bold text-white">
                    My Applications
                </h1>

                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-lg text-gray-400">
                            Loading applications...
                        </p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-lg">
                        <h2 className="text-2xl font-semibold text-white">
                            No Applications Found
                        </h2>

                        <p className="mt-3 text-gray-400">
                            You haven't applied for any jobs yet.
                        </p>

                        <Link
                            href="/jobs"
                            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div
                                key={app._id}
                                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-lg transition hover:border-blue-500/40 hover:shadow-xl"
                            >
                                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                                    <div>

                                        <h2 className="text-2xl font-bold text-white">
                                            {app.job?.title}
                                        </h2>

                                        <p className="mt-2 text-gray-400">
                                            {app.job?.company}
                                        </p>

                                        <p className="mt-1 text-gray-500">
                                            📍 {app.job?.location}
                                        </p>

                                        <p className="mt-3 text-lg font-semibold text-green-400">
                                            ₹{" "}
                                            {app.job?.package?.toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                        <p className="mt-3 text-sm text-gray-400">
                                            Applied on{" "}
                                            {new Date(
                                                app.createdAt
                                            ).toLocaleDateString("en-IN")}
                                        </p>

                                        {app.job?.deadline && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                Deadline:{" "}
                                                {new Date(
                                                    app.job.deadline
                                                ).toLocaleDateString("en-IN")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-4">

                                        <span
                                            className={`rounded-full px-5 py-2 text-sm font-semibold ${getStatusColor(
                                                app.status
                                            )}`}
                                        >
                                            {app.status}
                                        </span>

                                        <Link
                                            href={`/jobs/${app.job?._id}`}
                                            className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
                                        >
                                            View Job
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
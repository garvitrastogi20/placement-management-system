"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import Link from "next/link";

export default function RecruiterJobsPage() {

    const [jobs, setJobs] =
        useState([]);

    useEffect(() => {

        const fetchJobs =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );

                    const res =
                        await api.get(
                            "/jobs",
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

                    setJobs(
                        res.data
                    );

                } catch (error) {

                    console.log(error);

                }
            };

        fetchJobs();

    }, []);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-950 text-white p-8">

                <h1 className="text-4xl font-bold mb-8">
                    Posted Jobs
                </h1>

                <div className="grid gap-6">

                    {jobs.map(
                        (job) => (

                            <div
                                key={job._id}
                                className="bg-gray-900 border border-gray-800 p-6 rounded-2xl"
                            >

                                <h2 className="text-2xl font-bold">
                                    {job.title}
                                </h2>

                                <p className="text-gray-400 mt-2">
                                    {job.company}
                                </p>

                                <p className="mt-2">
                                    📍 {job.location}
                                </p>

                                <p className="mt-2 text-green-400">
                                    ₹ {job.package?.toLocaleString()}
                                </p>

                                <Link
                                    href={`/recruiter/jobs/${job._id}`}
                                    className="inline-block mt-4 bg-blue-600 px-4 py-2 rounded-lg"
                                >
                                    View Applicants
                                </Link>

                            </div>
                        )
                    )}

                </div>

            </div>
        </>
    );
}
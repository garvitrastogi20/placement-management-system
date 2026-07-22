"use client";

import { useEffect, useState } from "react";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import api from "@/services/api";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get("/jobs");
                setJobs(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <PageContainer>
            <Navbar />

            <div className="mt-8">
                <h1 className="mb-8 text-4xl font-bold text-white">
                    Available Jobs
                </h1>

                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-lg text-gray-400">
                            Loading jobs...
                        </p>
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
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
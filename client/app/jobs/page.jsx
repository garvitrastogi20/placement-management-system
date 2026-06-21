"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import api from "@/services/api";

export default function JobsPage() {

    const [jobs, setJobs] =
        useState([]);

    useEffect(() => {

        const fetchJobs = async () => {

            try {

                const res =
                    await api.get("/jobs");

                setJobs(res.data);

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
                    Available Jobs
                </h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {jobs.map((job) => (
                        <JobCard
                            key={job._id}
                            job={job}
                        />
                    ))}

                </div>

            </div>
        </>
    );
}
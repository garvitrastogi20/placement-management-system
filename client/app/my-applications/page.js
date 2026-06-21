"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/services/api";

export default function MyApplicationsPage() {

    const [applications, setApplications] =
        useState([]);

    useEffect(() => {

        const fetchApplications =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );

                    const res =
                        await api.get(
                            "/jobs/my-applications",
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

                    setApplications(
                        res.data
                    );

                } catch (error) {

                    console.log(error);

                }
            };

        fetchApplications();

    }, []);

    const getStatusColor =
        (status) => {

            switch (status) {

                case "Selected":
                    return "bg-green-900 text-green-300";

                case "Shortlisted":
                    return "bg-blue-900 text-blue-300";

                case "Rejected":
                    return "bg-red-900 text-red-300";

                default:
                    return "bg-yellow-900 text-yellow-300";
            }
        };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-950 text-white p-8">

                <h1 className="text-4xl font-bold mb-8">
                    My Applications
                </h1>

                <div className="grid gap-6">

                    {applications.map(
                        (app) => (

                            <div
                                key={app._id}
                                className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition"
                            >

                                <div className="flex justify-between items-center">

                                    <div>

                                        <h2 className="text-2xl font-bold">
                                            {app.job?.title}
                                        </h2>

                                        <p className="text-gray-400 mt-2">
                                            {app.job?.company}
                                        </p>

                                        <p className="text-gray-500 mt-1">
                                            📍 {app.job?.location}
                                        </p>

                                        <p className="text-green-400 mt-2 font-semibold">
                                            ₹ {app.job?.package?.toLocaleString()}
                                        </p>

                                    </div>

                                    <span
                                        className={`px-4 py-2 rounded-full font-medium ${getStatusColor(app.status)}`}
                                    >
                                        {app.status}
                                    </span>

                                </div>

                            </div>
                        )
                    )}

                </div>

            </div>
        </>
    );
}
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function ApplicantsPage() {

    const params = useParams();

    const [applications, setApplications] =
        useState([]);

    const fetchApplicants =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const res =
                    await api.get(
                        `/jobs/${params.id}/applicants`,
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

    useEffect(() => {

        if (params.id) {

            fetchApplicants();

        }

    }, [params.id]);

    const updateStatus =
        async (
            applicationId,
            status
        ) => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );
                await api.patch(
                    `/applications/${applicationId}/status`,
                    { status },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                toast.success(
                    `Student ${status}`
                );

                fetchApplicants();

            } catch (error) {

                toast.error(
                    "Status update failed"
                );

            }
        };

    const getStatusColor =
        (status) => {

            switch (status) {

                case "Shortlisted":
                    return "bg-blue-900 text-blue-300";

                case "Selected":
                    return "bg-green-900 text-green-300";

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
                    Applicants
                </h1>

                <div className="grid gap-6">

                    {applications.map(
                        (app) => (

                            <div
                                key={app._id}
                                className="bg-gray-900 border border-gray-800 p-6 rounded-2xl"
                            >

                                <div className="flex justify-between items-center">

                                    <div>

                                        <h2 className="text-2xl font-bold">
                                            {app.student?.name}
                                        </h2>

                                        <p className="text-gray-400 mt-2">
                                            {app.student?.email}
                                        </p>

                                    </div>

                                    <span
                                        className={`px-4 py-2 rounded-full ${getStatusColor(app.status)}`}
                                    >
                                        {app.status}
                                    </span>

                                </div>

                                <div className="flex gap-4 mt-6">

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                app._id,
                                                "Shortlisted"
                                            )
                                        }
                                        className="bg-blue-600 px-4 py-2 rounded-lg"
                                    >
                                        Shortlist
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                app._id,
                                                "Rejected"
                                            )
                                        }
                                        className="bg-red-600 px-4 py-2 rounded-lg"
                                    >
                                        Reject
                                    </button>

                                </div>

                            </div>
                        )
                    )}

                </div>

            </div>
        </>
    );
}
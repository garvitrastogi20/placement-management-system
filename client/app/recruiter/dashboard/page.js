"use client";

import Navbar from "@/components/Navbar";

export default function RecruiterDashboard() {

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-950 text-white p-8">

                <h1 className="text-4xl font-bold mb-8">
                    Recruiter Dashboard
                </h1>

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

                        <h2 className="text-gray-400">
                            Jobs Posted
                        </h2>

                        <p className="text-4xl font-bold mt-3 text-blue-400">
                            0
                        </p>

                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

                        <h2 className="text-gray-400">
                            Applications
                        </h2>

                        <p className="text-4xl font-bold mt-3 text-green-400">
                            0
                        </p>

                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

                        <h2 className="text-gray-400">
                            Shortlisted
                        </h2>

                        <p className="text-4xl font-bold mt-3 text-yellow-400">
                            0
                        </p>

                    </div>

                </div>

                <div className="mt-8">

                    <a
                        href="/recruiter/create-job"
                        className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700"
                    >
                        Create Job
                    </a>

                </div>

            </div>
        </>
    );
}
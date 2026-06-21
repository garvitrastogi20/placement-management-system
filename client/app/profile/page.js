"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ResumeUpload from "@/components/ResumeUpload";
import api from "@/services/api";

export default function ProfilePage() {

    const [profile, setProfile] =
        useState(null);

    useEffect(() => {

        const fetchProfile =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );

                    const res =
                        await api.get(
                            "/student/profile",
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

                    setProfile(
                        res.data
                    );

                } catch (error) {

                    console.log(error);

                }
            };

        fetchProfile();

    }, []);

    if (!profile) {

        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                    Loading...
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-950 text-white p-8">

                {/* Profile Card */}

                <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg">

                    <h1 className="text-4xl font-bold mb-8">
                        Student Profile
                    </h1>

                    <div className="space-y-5">

                        <div>
                            <p className="text-gray-400">
                                College
                            </p>

                            <p className="text-xl">
                                {profile.college}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-400">
                                Branch
                            </p>

                            <p className="text-xl">
                                {profile.branch}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-400">
                                CGPA
                            </p>

                            <p className="text-xl">
                                {profile.cgpa}
                            </p>
                        </div>

                        <div>

                            <p className="text-gray-400 mb-2">
                                Skills
                            </p>

                            <div className="flex flex-wrap gap-3">

                                {profile.skills?.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-900 text-blue-300 px-4 py-2 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}

                            </div>

                        </div>

                        <div>

                            <p className="text-gray-400">
                                Resume
                            </p>

                            {profile.resumeUrl ? (

                                <a
                                    href={profile.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-400 underline"
                                >
                                    View Resume
                                </a>

                            ) : (

                                <p className="text-red-400">
                                    No Resume Uploaded
                                </p>

                            )}

                        </div>

                    </div>

                </div>

                {/* Resume Upload Section */}

                <div className="max-w-4xl mx-auto mt-8">

                    <ResumeUpload />

                </div>

            </div>
        </>
    );
}
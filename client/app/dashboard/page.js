"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Background from "@/components/ui/Background";
import Hero from "@/components/dashboard/Hero";
import QuickStats from "@/components/dashboard/QuickStats";
import api from "@/services/api";

export default function Dashboard() {

    const router = useRouter();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await api.get(
                    "/student/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setDashboard(res.data);

            } catch (error) {

                if (error.response?.status === 404) {

                    router.push("/profile");
                    return;

                }

                if (error.response?.status === 401) {

                    router.push("/login");
                    return;

                }

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchDashboard();

    }, [router]);

    if (loading) {

        return (

            <Background>

                <Navbar />

                <div className="min-h-screen flex items-center justify-center">

                    <h1 className="text-2xl font-semibold text-white">

                        Loading...

                    </h1>

                </div>

            </Background>

        );

    }

    if (!dashboard) {

        return null;

    }

    return (

        <Background>

            <Navbar />

            <div className="min-h-screen max-w-7xl mx-auto px-8 py-10">

                {/* Hero */}

                <Hero
                    profile={{
                        ...dashboard.profile,
                        user: dashboard.user,
                    }}
                />

                {/* Quick Stats */}

                <QuickStats dashboard={dashboard} />

                {/* Skills */}

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl">

                    <h2 className="text-2xl font-bold mb-6">

                        Skills

                    </h2>

                    <div className="flex flex-wrap gap-3">

                        {dashboard.profile.skills?.map((skill, index) => (

                            <span
                                key={index}
                                className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-medium shadow-lg"
                            >

                                {skill}

                            </span>

                        ))}

                    </div>

                </div>

                {/* Resume */}

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl">

                    <h2 className="text-2xl font-bold mb-4">

                        Resume

                    </h2>

                    {dashboard.profile.resumeUrl ? (

                        <a
                            href={dashboard.profile.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-semibold transition hover:scale-105"
                        >

                            View Resume

                        </a>

                    ) : (

                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5">

                            <p className="text-red-400 font-medium">

                                Resume not uploaded yet.

                            </p>

                            <p className="text-gray-400 text-sm mt-2">

                                Upload your resume to increase your chances of getting shortlisted.

                            </p>

                        </div>

                    )}

                </div>

            </div>

        </Background>

    );

}
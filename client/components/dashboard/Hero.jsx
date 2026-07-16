"use client";

import Link from "next/link";
import {
    FaUserGraduate,
    FaBriefcase,
    FaUserEdit,
    FaCheckCircle,
} from "react-icons/fa";

export default function Hero({ profile }) {

    const completion = () => {

        let total = 5;
        let done = 0;

        if (profile.user?.name) done++;
        if (profile.college) done++;
        if (profile.branch) done++;
        if (profile.skills?.length > 0) done++;
        if (profile.resumeUrl) done++;

        return Math.round((done / total) * 100);

    };

    const percentage = completion();

    return (

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-2xl">

            {/* Glow */}

            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-purple-500/20 blur-[120px]" />

            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/20 blur-[120px]" />

            <div className="relative flex flex-col lg:flex-row justify-between gap-10">

                {/* Left */}

                <div className="flex gap-6">

                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold shadow-xl">

                        {profile.user?.name?.charAt(0)}

                    </div>

                    <div>

                        <h1 className="text-5xl font-bold">

                            Welcome Back,

                        </h1>

                        <h2 className="mt-2 text-3xl font-semibold text-blue-300">

                            {profile.user?.name}

                        </h2>

                        <div className="mt-4 space-y-2 text-gray-300">

                            <p>

                                <FaUserGraduate className="inline mr-2" />

                                {profile.branch}

                            </p>

                            <p>

                                {profile.college}

                            </p>

                        </div>

                    </div>

                </div>

                {/* Right */}

                <div className="min-w-[320px] rounded-2xl bg-black/20 p-6 border border-white/10">

                    <div className="flex justify-between">

                        <span className="text-gray-400">

                            Profile Completion

                        </span>

                        <span className="font-bold text-green-400">

                            {percentage}%

                        </span>

                    </div>

                    <div className="mt-3 h-3 rounded-full bg-gray-700">

                        <div

                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400"

                            style={{
                                width: `${percentage}%`,
                            }}

                        />

                    </div>

                    <div className="mt-8 space-y-3 text-gray-300">

                        <div className="flex justify-between">

                            <span>

                                Resume

                            </span>

                            {profile.resumeUrl ?

                                <FaCheckCircle className="text-green-400" />

                                :

                                <span className="text-red-400">

                                    ✖

                                </span>

                            }

                        </div>

                        <div className="flex justify-between">

                            <span>

                                Skills

                            </span>

                            <span>

                                {profile.skills.length}

                            </span>

                        </div>

                    </div>

                    <div className="mt-8 flex gap-3">

                        <Link

                            href="/jobs"

                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold hover:scale-105 transition"

                        >

                            <FaBriefcase />

                            Jobs

                        </Link>

                        <Link

                            href="/profile"

                            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/20 py-3 hover:bg-white/10 transition"

                        >

                            <FaUserEdit />

                            Profile

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}
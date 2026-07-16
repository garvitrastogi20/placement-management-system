"use client";

import { FaBriefcase } from "react-icons/fa";

export default function Hero({ profile }) {

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {

        greeting = "Good Morning";

    } else if (hour < 18) {

        greeting = "Good Afternoon";

    }

    return (

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-10 shadow-2xl">

            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row justify-between items-center gap-8">

                <div>

                    <p className="text-blue-100 text-lg">
                        {greeting}
                    </p>

                    <h1 className="text-5xl font-extrabold mt-2">

                        {profile?.user?.name || "Student"} 👋

                    </h1>

                    <p className="text-blue-100 mt-4 text-lg">

                        Welcome back! Continue your placement journey
                        and discover new opportunities.

                    </p>

                </div>

                <button className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-xl hover:scale-105 transition">

                    <FaBriefcase className="inline mr-2" />

                    Browse Jobs

                </button>

            </div>

        </div>

    );

}
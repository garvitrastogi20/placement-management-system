"use client";

import Link from "next/link";
import { FaRocket } from "react-icons/fa";

export default function Logo() {

    return (

        <Link
            href="/dashboard"
            className="flex items-center gap-3"
        >

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-600 shadow-xl">

                <FaRocket className="text-white text-xl" />

            </div>

            <div>

                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">

                    PlacementAI

                </h1>

                <p className="text-xs text-gray-400">

                    AI Powered Campus Recruitment

                </p>

            </div>

        </Link>

    );

}
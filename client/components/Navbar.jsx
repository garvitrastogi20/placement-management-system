"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <h1 className="text-2xl font-bold text-blue-400">
                    Placement Portal
                </h1>

                <div className="flex items-center gap-6 text-gray-300 font-medium">

                    <Link
                        href="/dashboard"
                        className="hover:text-blue-400 transition"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/jobs"
                        className="hover:text-blue-400 transition"
                    >
                        Jobs
                    </Link>

                    <Link
                        href="/my-applications"
                        className="hover:text-blue-400 transition"
                    >
                        Applications
                    </Link>

                    <Link
                        href="/profile"
                        className="hover:text-blue-400 transition"
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 text-white transition"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
}
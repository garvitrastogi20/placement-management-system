"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaBriefcase,
  FaFileAlt,
  FaUser,
  FaSignOutAlt,
  FaRobot,
} from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setName(localStorage.getItem("name") || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const linkStyle = (href) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
      pathname === href
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  if (role === null) {
    return (
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <nav className="h-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <nav className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
          <div className="flex h-20 items-center justify-between px-8">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent"
            >
              PlacementAI
            </Link>

            {/* Student Navigation */}
            <div className="flex items-center gap-3">
              {role === "student" && (
                <>
                  <Link href="/dashboard" className={linkStyle("/dashboard")}>
                    <FaHome />
                    Dashboard
                  </Link>

                  <Link href="/jobs" className={linkStyle("/jobs")}>
                    <FaBriefcase />
                    Jobs
                  </Link>

                  {/* Interview Preparation */}
                  <Link
                    href="/interview-preparation"
                    className={linkStyle("/interview-preparation")}
                  >
                    <FaRobot />
                    Interview Prep
                  </Link>

                  {/* AI Mock Interview */}
                  <Link
                    href="/mock-interview"
                    className={linkStyle("/mock-interview")}
                  >
                    <FaRobot />
                    Mock Interview
                  </Link>

                  <Link
                    href="/my-applications"
                    className={linkStyle("/my-applications")}
                  >
                    <FaFileAlt />
                    Applications
                  </Link>

                  <Link href="/profile" className={linkStyle("/profile")}>
                    <FaUser />
                    Profile
                  </Link>
                </>
              )}
            </div>

            {/* User Profile and Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-white">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </div>

                <div>
                  <p className="text-sm text-gray-400">Welcome</p>

                  <p className="font-semibold text-white">
                    {name || "Student"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-5 py-3 font-medium transition hover:bg-red-700"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

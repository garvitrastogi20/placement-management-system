"use client";

import Link from "next/link";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import { useEffect, useState } from "react";

export default function LandingHeader() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    } catch {}
  }, []);

  const dashboardHref = role === "recruiter" ? "/recruiter/dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#090807]/80 transition-colors">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Logo />

        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-gray-300">
          <a href="#features" className="transition hover:text-blue-600 dark:hover:text-[#F4C27A]">
            Features
          </a>
          <a href="#stats" className="transition hover:text-blue-600 dark:hover:text-[#F4C27A]">
            Impact
          </a>
          <a href="#companies" className="transition hover:text-blue-600 dark:hover:text-[#F4C27A]">
            Recruiters
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />

          {token ? (
            <Link
              href={dashboardHref}
              className="whitespace-nowrap rounded-xl bg-blue-600 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#C97B3C] dark:to-[#F4C27A] dark:text-black dark:shadow-md"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="whitespace-nowrap hidden sm:inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#C97B3C] dark:to-[#F4C27A] dark:text-black dark:shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

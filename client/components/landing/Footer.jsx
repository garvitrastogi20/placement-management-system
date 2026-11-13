"use client";

import Link from "next/link";
import Logo from "../common/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-[#070606] transition-colors">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="max-w-sm text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
              PlacementAI streamlines campus placements with intelligent resume scoring, automated interview simulators, and direct candidate pipelines.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-gray-400">
              <li>
                <Link href="/jobs" className="transition hover:text-blue-600 dark:hover:text-[#F4C27A]">
                  Browse Openings
                </Link>
              </li>
              <li>
                <Link href="/resume-analyzer" className="transition hover:text-blue-600 dark:hover:text-[#F4C27A]">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link href="/mock-interview" className="transition hover:text-blue-600 dark:hover:text-[#F4C27A]">
                  Mock Interview AI
                </Link>
              </li>
              <li>
                <Link href="/interview-preparation" className="transition hover:text-blue-600 dark:hover:text-[#F4C27A]">
                  Interview Preparation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-900 dark:text-white">
              Portals
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-gray-400">
              <li>
                <Link href="/login" className="transition hover:text-blue-600 dark:hover:text-[#F4C27A]">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-blue-600 dark:hover:text-[#F4C27A]">
                  Recruiter Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-blue-600 dark:hover:text-[#F4C27A]">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-gray-500">
          <p>© {new Date().getFullYear()} Placementor AI. Built for real-world campus recruitment.</p>
          <div className="flex gap-6">
            <span>Status: Production Ready</span>
            <span>Security: Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { FaRocket, FaGraduationCap, FaBuilding } from "react-icons/fa";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 p-8 sm:p-14 text-center shadow-lg backdrop-blur-2xl dark:border-[#C97B3C]/20 dark:from-[#1A1613] dark:via-[#121212] dark:to-[#09090B] dark:shadow-[0_25px_80px_rgba(0,0,0,.5)]">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px] dark:bg-[#C97B3C]/20" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-[100px] dark:bg-[#F4C27A]/15" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl text-white shadow-md dark:from-[#C97B3C] dark:to-[#F4C27A] dark:text-black">
              <FaRocket />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Ready to Accelerate Your Placement Journey?
            </h2>

            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-gray-300 leading-relaxed">
              Join thousands of students polishing resumes and practicing AI interviews, or recruiters hiring exceptional campus talent with automated pipelines.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98] dark:bg-gradient-to-r dark:from-[#C97B3C] dark:to-[#F4C27A] dark:text-black dark:shadow-[0_10px_35px_rgba(201,123,60,.35)]"
              >
                <FaGraduationCap />
                Student Sign Up
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white/80 px-8 py-4 text-base font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <FaBuilding />
                Recruiter Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

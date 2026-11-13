"use client";

import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaClock,
  FaBuilding,
} from "react-icons/fa";

export default function JobCard({ job, onApply, applying = false }) {
  const isApplied = Boolean(job?.isApplied || job?.applied);

  const company = job?.company || "Company not specified";
  const title = job?.title || "Untitled Position";
  const location = job?.location || "Location not specified";

  const skills = Array.isArray(job?.skillsRequired)
    ? job.skillsRequired
    : Array.isArray(job?.skills)
      ? job.skills
      : [];

  const salary = Number(job?.package);

  const formattedSalary =
    Number.isFinite(salary) && salary > 0
      ? `₹${salary.toLocaleString("en-IN")}`
      : "Not disclosed";

  const deadline = job?.deadline ? new Date(job.deadline) : null;

  const hasDeadline = deadline && !Number.isNaN(deadline.getTime());

  const jobId = job?._id;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-md dark:border-[#C97B3C]/15 dark:bg-[#100e0c]/90 dark:text-white dark:hover:border-[#C97B3C]/40 dark:hover:bg-[#15110e] dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
      {/* Accent strip */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/70 to-transparent dark:via-[#C97B3C]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Company and application status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-50 text-lg font-bold text-blue-600 dark:border-[#C97B3C]/25 dark:bg-gradient-to-br dark:from-[#C97B3C]/20 dark:to-[#F4C27A]/5 dark:text-[#F4C27A]">
              {company.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-gray-100">
                {company}
              </p>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-500">
                <FaBuilding className="shrink-0 text-blue-600 dark:text-[#C97B3C]" />
                <span>Hiring company</span>
              </div>
            </div>
          </div>

          {isApplied ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <FaCheckCircle />
              Applied
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:border-[#C97B3C]/20 dark:bg-[#C97B3C]/10 dark:text-[#F4C27A]">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-[#C97B3C]" />
              Open
            </span>
          )}
        </div>

        {/* Job title and location */}
        <div className="mt-6">
          <h2 className="line-clamp-2 min-h-[3.5rem] text-xl font-bold leading-7 text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-[#F4C27A]">
            {title}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
            <FaMapMarkerAlt className="shrink-0 text-blue-600 dark:text-[#C97B3C]" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Salary */}
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#C97B3C]/10 dark:bg-white/[0.025]">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-gray-500">
              Package
            </p>

            <p className="mt-1.5 text-lg font-bold text-emerald-600 dark:text-[#F4C27A]">
              {formattedSalary}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-600 dark:border-[#C97B3C]/15 dark:bg-[#C97B3C]/10 dark:text-[#F4C27A]">
            <FaRupeeSign />
          </div>
        </div>

        {/* Required skills */}
        <div className="mt-5">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-500">
            Required skills
          </p>

          {skills.length > 0 ? (
            <div className="flex min-h-7 flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700 transition-colors dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-gray-300 dark:group-hover:border-[#C97B3C]/15"
                >
                  {skill}
                </span>
              ))}

              {skills.length > 3 && (
                <span className="rounded-lg border border-blue-500/20 bg-blue-50 px-2.5 py-1.5 text-xs text-blue-700 dark:border-[#C97B3C]/15 dark:bg-[#C97B3C]/10 dark:text-[#F4C27A]">
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-gray-500">Skills not specified</p>
          )}
        </div>

        {/* Deadline */}
        <div className="mt-5 flex min-h-5 items-center gap-2 text-xs text-slate-500 dark:text-gray-500">
          <FaClock className="text-blue-600 dark:text-[#C97B3C]" />

          {hasDeadline ? (
            <span>
              Deadline:{" "}
              {deadline.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          ) : (
            <span>No deadline specified</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-auto flex gap-3 pt-6">
          {jobId && (
            <Link
              href={`/jobs/${jobId}`}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-[#C97B3C]/20 dark:text-[#F4C27A] transition dark:hover:border-[#C97B3C]/50 dark:hover:bg-[#C97B3C]/10"
            >
              Details
              <FaExternalLinkAlt className="text-xs" />
            </Link>
          )}

          <button
            type="button"
            disabled={isApplied || applying || !onApply}
            onClick={() => onApply?.(job)}
            className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              isApplied
                ? "cursor-not-allowed border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : applying || !onApply
                  ? "cursor-not-allowed bg-blue-400 text-white dark:bg-[#C97B3C]/50 dark:text-black/60"
                  : "bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#C97B3C] dark:to-[#F4C27A] dark:text-[#090807] dark:shadow-lg dark:shadow-[#C97B3C]/10 dark:hover:brightness-110 active:scale-[0.98]"
            }`}
          >
            {isApplied ? (
              <>
                <FaCheckCircle />
                Applied
              </>
            ) : applying ? (
              "Applying..."
            ) : (
              <>
                Apply now
                <FaExternalLinkAlt className="text-xs" />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

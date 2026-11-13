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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#C97B3C]/15 bg-[#100e0c]/90 transition-all duration-300 hover:-translate-y-1 hover:border-[#C97B3C]/40 hover:bg-[#15110e] hover:shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
      {/* Copper accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C97B3C]/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Company and application status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#C97B3C]/25 bg-gradient-to-br from-[#C97B3C]/20 to-[#F4C27A]/5 text-lg font-bold text-[#F4C27A]">
              {company.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-100">
                {company}
              </p>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <FaBuilding className="shrink-0 text-[#C97B3C]" />
                <span>Hiring company</span>
              </div>
            </div>
          </div>

          {isApplied ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300">
              <FaCheckCircle />
              Applied
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#C97B3C]/20 bg-[#C97B3C]/10 px-2.5 py-1.5 text-xs font-medium text-[#F4C27A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C97B3C]" />
              Open
            </span>
          )}
        </div>

        {/* Job title and location */}
        <div className="mt-6">
          <h2 className="line-clamp-2 min-h-[3.5rem] text-xl font-bold leading-7 text-white transition-colors group-hover:text-[#F4C27A]">
            {title}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <FaMapMarkerAlt className="shrink-0 text-[#C97B3C]" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Salary */}
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#C97B3C]/10 bg-white/[0.025] p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Package
            </p>

            <p className="mt-1.5 text-lg font-bold text-[#F4C27A]">
              {formattedSalary}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C97B3C]/15 bg-[#C97B3C]/10 text-[#F4C27A]">
            <FaRupeeSign />
          </div>
        </div>

        {/* Required skills */}
        <div className="mt-5">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Required skills
          </p>

          {skills.length > 0 ? (
            <div className="flex min-h-7 flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-lg border border-white/[0.07] bg-white/[0.035] px-2.5 py-1.5 text-xs text-gray-300 transition-colors group-hover:border-[#C97B3C]/15"
                >
                  {skill}
                </span>
              ))}

              {skills.length > 3 && (
                <span className="rounded-lg border border-[#C97B3C]/15 bg-[#C97B3C]/10 px-2.5 py-1.5 text-xs text-[#F4C27A]">
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Skills not specified</p>
          )}
        </div>

        {/* Deadline */}
        <div className="mt-5 flex min-h-5 items-center gap-2 text-xs text-gray-500">
          <FaClock className="text-[#C97B3C]" />

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
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#C97B3C]/20 px-3 py-3 text-sm font-semibold text-[#F4C27A] transition hover:border-[#C97B3C]/50 hover:bg-[#C97B3C]/10"
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
                ? "cursor-not-allowed border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : applying || !onApply
                  ? "cursor-not-allowed bg-[#C97B3C]/50 text-black/60"
                  : "bg-gradient-to-r from-[#C97B3C] to-[#F4C27A] text-[#090807] shadow-lg shadow-[#C97B3C]/10 hover:brightness-110 active:scale-[0.98]"
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

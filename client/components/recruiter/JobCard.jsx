"use client";

import Link from "next/link";
import { FaMapMarkerAlt, FaUsers, FaCalendarAlt } from "react-icons/fa";

export default function JobCard({ job }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {job.title}
          </h3>

          <p className="mt-1 text-gray-400">
            {job.company}
          </p>
        </div>

        <span className="rounded-full bg-blue-600 px-3 py-1 text-sm">
          ₹ {job.package}
        </span>
      </div>

      <div className="mt-5 space-y-3 text-gray-300">

        <div className="flex items-center gap-2">
          <FaMapMarkerAlt />
          {job.location}
        </div>

        <div className="flex items-center gap-2">
          <FaUsers />
          {job.applicantCount || 0} Applicants
        </div>

        <div className="flex items-center gap-2">
          <FaCalendarAlt />
          {new Date(job.deadline).toLocaleDateString()}
        </div>

      </div>

      <Link
        href={`/recruiter/jobs`}
        className="mt-6 inline-block font-medium text-blue-400 hover:text-blue-300"
      >
        View Details →
      </Link>
    </div>
  );
}
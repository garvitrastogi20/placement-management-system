"use client";

import { FaEnvelope, FaCalendarAlt, FaFileAlt } from "react-icons/fa";

import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

import ApplicantAvatar from "./ApplicantAvatar";
import ApplicantActions from "./ApplicantActions";

export default function ApplicantCard({ application, updateStatus }) {
  const { _id, student, status, createdAt } = application;

  const studentName = student?.name || "Unknown Student";
  const studentEmail = student?.email || "No email provided";
  const studentSkills = Array.isArray(student?.skills) ? student.skills : [];
  const appliedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "Date unavailable";

  return (
    <GlassCard>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}

        <div className="flex gap-5">
          <ApplicantAvatar name={studentName} />

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{studentName}</h2>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3 text-slate-500 dark:text-gray-400">
                <FaEnvelope className="text-blue-600 dark:text-[#C97B3C]" />

                {studentEmail}
              </div>

              <div className="flex items-center gap-3 text-slate-500 dark:text-gray-400">
                <FaCalendarAlt className="text-blue-600 dark:text-[#C97B3C]" />
                Applied on {appliedDate}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="flex flex-col items-start gap-4 lg:items-end">
          {status === "Applied" && <Badge variant="info">Applied</Badge>}

          {status === "Shortlisted" && (
            <Badge variant="warning">Shortlisted</Badge>
          )}

          {status === "Selected" && <Badge variant="success">Selected</Badge>}

          {status === "Rejected" && <Badge variant="danger">Rejected</Badge>}

          <button
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-blue-200
              bg-blue-50
              px-4
              py-2
              text-blue-700
              transition
              hover:bg-blue-100
              dark:border-[#C97B3C]/30
              dark:bg-[#C97B3C]/10
              dark:text-[#F4C27A]
              dark:hover:bg-[#C97B3C]/20
            "
          >
            <FaFileAlt />
            Resume
          </button>
        </div>
      </div>

      {/* Divider */}

      <div className="my-6 h-px bg-slate-200 dark:bg-white/10" />

      {/* Skills */}

      <div className="mb-6">
        <p className="mb-3 text-sm uppercase tracking-wider text-slate-500 dark:text-gray-400">
          Skills
        </p>

        <div className="flex flex-wrap gap-3">
          {studentSkills.length === 0 ? (
            <span className="text-slate-400 dark:text-gray-500">No skills available</span>
          ) : (
            studentSkills.map((skill) => (
              <span
                key={skill}
                className="
                  rounded-full
                  border
                  border-blue-200
                  bg-blue-50
                  px-4
                  py-2
                  text-sm
                  text-blue-700
                  dark:border-[#C97B3C]/20
                  dark:bg-[#C97B3C]/10
                  dark:text-[#F4C27A]
                "
              >
                {skill}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Actions */}

      <ApplicantActions applicationId={_id} updateStatus={updateStatus} />
    </GlassCard>
  );
}

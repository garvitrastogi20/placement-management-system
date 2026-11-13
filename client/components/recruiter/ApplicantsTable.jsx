"use client";

import { FaCheckCircle, FaTimesCircle, FaUserCheck } from "react-icons/fa";

import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";

export default function ApplicantsTable({ applicants = [], updateStatus }) {
  if (!applicants || applicants.length === 0) {
    return (
      <EmptyState
        title="No Applicants Yet"
        subtitle="Students who apply for this job will appear here."
      />
    );
  }

  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-[0.18em] text-gray-400">
              <th className="px-6 py-5">Student</th>

              <th className="px-6 py-5">Email</th>

              <th className="px-6 py-5">Status</th>

              <th className="px-6 py-5">Applied</th>

              <th className="px-6 py-5 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applicants.map((app) => (
              <tr
                key={app._id}
                className="
                  border-b
                  border-white/5
                  transition-all
                  duration-300
                  hover:bg-white/[0.03]
                "
              >
                {/* Student */}

                <td className="px-6 py-6">
                  <div>
                    <p className="font-semibold text-white">
                      {app.student.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">Student</p>
                  </div>
                </td>

                {/* Email */}

                <td className="px-6 text-gray-400">{app.student.email}</td>

                {/* Status */}

                <td className="px-6">
                  {app.status === "Applied" && (
                    <Badge variant="info">Applied</Badge>
                  )}

                  {app.status === "Shortlisted" && (
                    <Badge variant="warning">Shortlisted</Badge>
                  )}

                  {app.status === "Selected" && (
                    <Badge variant="success">Selected</Badge>
                  )}

                  {app.status === "Rejected" && (
                    <Badge variant="danger">Rejected</Badge>
                  )}
                </td>

                {/* Applied Date */}

                <td className="px-6 text-gray-400">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}

                <td className="px-6">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => updateStatus(app._id, "Shortlisted")}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-yellow-500/30
                        bg-yellow-500/10
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-yellow-400
                        transition-all
                        duration-300
                        hover:bg-yellow-500/20
                      "
                    >
                      <FaUserCheck />
                      Shortlist
                    </button>

                    <button
                      onClick={() => updateStatus(app._id, "Selected")}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-green-500/30
                        bg-green-500/10
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-green-400
                        transition-all
                        duration-300
                        hover:bg-green-500/20
                      "
                    >
                      <FaCheckCircle />
                      Select
                    </button>

                    <button
                      onClick={() => updateStatus(app._id, "Rejected")}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-red-500/30
                        bg-red-500/10
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-red-400
                        transition-all
                        duration-300
                        hover:bg-red-500/20
                      "
                    >
                      <FaTimesCircle />
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

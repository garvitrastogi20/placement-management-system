"use client";

import {
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";

import GlassCard from "@/components/ui/GlassCard";

export default function RecentActivity({ applications = [] }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "Selected":
        return {
          icon: <FaCheckCircle />,
          text: "Selected",
          className: "border-green-500/20 bg-green-500/10 text-green-400",
        };

      case "Shortlisted":
        return {
          icon: <FaCheckCircle />,
          text: "Shortlisted",
          className: "border-[#C97B3C]/30 bg-[#C97B3C]/10 text-[#F4C27A]",
        };

      case "Rejected":
        return {
          icon: <FaTimesCircle />,
          text: "Rejected",
          className: "border-red-500/20 bg-red-500/10 text-red-400",
        };

      default:
        return {
          icon: <FaClock />,
          text: "Applied",
          className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <GlassCard>
      {/* Header */}

      <div className="mb-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-[#C97B3C]/20
              bg-[#C97B3C]/10
              text-[#F4C27A]
            "
          >
            <FaBriefcase />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C97B3C]">
              APPLICATIONS
            </p>

            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
          </div>
        </div>
      </div>

      {/* Empty State */}

      {applications.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-white/10
            bg-white/[0.02]
            p-8
            text-center
          "
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C97B3C]/10 text-2xl text-[#F4C27A]">
            <FaBriefcase />
          </div>

          <h3 className="mt-4 font-semibold text-white">No applications yet</h3>

          <p className="mt-2 text-sm text-gray-500">
            Your recent job applications will appear here.
          </p>
        </div>
      ) : (
        /* Applications */

        <div className="space-y-4">
          {applications.map((application) => {
            const status = getStatusConfig(application.status);

            return (
              <div
                key={application._id}
                className="
                  group
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  p-5
                  transition-all
                  duration-300
                  hover:border-[#C97B3C]/20
                  hover:bg-[#C97B3C]/5
                "
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Job */}

                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#C97B3C]/10
                        text-[#F4C27A]
                      "
                    >
                      <FaBriefcase />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {application.job?.title || "Job"}
                      </h3>

                      <p className="mt-1 truncate text-sm text-gray-500">
                        {application.job?.company || "Company"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}

                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        ${status.className}
                      `}
                    >
                      {status.icon}
                      {status.text}
                    </span>
                  </div>
                </div>

                {/* Bottom Information */}

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.05] pt-4 text-xs text-gray-500">
                  <span>
                    Applied on{" "}
                    <span className="text-gray-400">
                      {formatDate(application.createdAt)}
                    </span>
                  </span>

                  {application.job?.location && (
                    <span>{application.job.location}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}

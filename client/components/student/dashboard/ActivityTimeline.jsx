"use client";

import {
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";

import GlassCard from "@/components/ui/GlassCard";

export default function ActivityTimeline({ applications = [] }) {
  const getActivity = (application) => {
    switch (application.status) {
      case "Selected":
        return {
          icon: <FaCheckCircle />,
          title: "Application Selected",
          description: `Congratulations! Your application for ${
            application.job?.title || "this position"
          } was selected.`,
          iconClass: "bg-green-500/10 text-green-400",
          lineClass: "bg-green-500/20",
        };

      case "Shortlisted":
        return {
          icon: <FaCheckCircle />,
          title: "Application Shortlisted",
          description: `Your application for ${
            application.job?.title || "this position"
          } has been shortlisted.`,
          iconClass: "bg-[#C97B3C]/10 text-[#F4C27A]",
          lineClass: "bg-[#C97B3C]/20",
        };

      case "Rejected":
        return {
          icon: <FaTimesCircle />,
          title: "Application Rejected",
          description: `Your application for ${
            application.job?.title || "this position"
          } was not selected.`,
          iconClass: "bg-red-500/10 text-red-400",
          lineClass: "bg-red-500/20",
        };

      default:
        return {
          icon: <FaClock />,
          title: "Application Submitted",
          description: `You applied for ${
            application.job?.title || "this position"
          } at ${application.job?.company || "the company"}.`,
          iconClass: "bg-blue-500/10 text-blue-400",
          lineClass: "bg-blue-500/20",
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

      <div className="mb-8 flex items-center justify-between gap-4">
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
              JOURNEY
            </p>

            <h2 className="text-2xl font-bold text-white">
              Application Timeline
            </h2>
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
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#C97B3C]/10
              text-2xl
              text-[#F4C27A]
            "
          >
            <FaBriefcase />
          </div>

          <h3 className="mt-4 font-semibold text-white">
            Your journey starts here
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Apply to jobs and your application activity will appear here.
          </p>
        </div>
      ) : (
        /* Timeline */

        <div className="relative">
          {applications.map((application, index) => {
            const activity = getActivity(application);

            const isLast = index === applications.length - 1;

            return (
              <div key={application._id} className="relative flex gap-5">
                {/* Timeline Line */}

                {!isLast && (
                  <div
                    className={`
                      absolute
                      left-[21px]
                      top-12
                      h-[calc(100%-12px)]
                      w-px
                      ${activity.lineClass}
                    `}
                  />
                )}

                {/* Icon */}

                <div
                  className={`
                    relative
                    z-10
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${activity.iconClass}
                  `}
                >
                  {activity.icon}
                </div>

                {/* Content */}

                <div
                  className={`
                    min-w-0
                    flex-1
                    pb-8
                    ${isLast ? "pb-0" : ""}
                  `}
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-white">
                      {activity.title}
                    </h3>

                    <span className="text-xs text-gray-600">
                      {formatDate(
                        application.updatedAt || application.createdAt,
                      )}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {activity.description}
                  </p>

                  {/* Job Details */}

                  {application.job && (
                    <div
                      className="
                        mt-4
                        rounded-xl
                        border
                        border-white/[0.05]
                        bg-white/[0.02]
                        p-4
                      "
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-300">
                            {application.job.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-600">
                            {application.job.company}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs text-gray-600">
                          {application.status}
                        </span>
                      </div>
                    </div>
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

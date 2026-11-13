"use client";

import {
  FaArrowRight,
  FaBriefcase,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

import { useRouter } from "next/navigation";

import GlassCard from "@/components/ui/GlassCard";

export default function RecommendedJobs({ jobs = [] }) {
  const router = useRouter();

  const formatPackage = (value) => {
    if (!value) return null;

    const amount = Number(value);

    if (Number.isNaN(amount)) {
      return value;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} LPA`;
    }

    return `₹${amount} LPA`;
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
              OPPORTUNITIES
            </p>

            <h2 className="text-2xl font-bold text-white">Recommended Jobs</h2>
          </div>
        </div>

        <button
          onClick={() => router.push("/jobs")}
          className="
            hidden
            items-center
            gap-2
            text-sm
            font-semibold
            text-[#F4C27A]
            transition
            hover:gap-3
            sm:flex
          "
        >
          View all
          <FaArrowRight />
        </button>
      </div>

      {/* Empty State */}

      {jobs.length === 0 ? (
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
            No matching jobs found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Add more skills to your profile or explore all available jobs.
          </p>

          <button
            onClick={() => router.push("/jobs")}
            className="
              mt-5
              rounded-xl
              bg-[#C97B3C]
              px-5
              py-2.5
              font-semibold
              text-black
              transition
              hover:bg-[#F4C27A]
            "
          >
            Explore Jobs
          </button>
        </div>
      ) : (
        /* Jobs */

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="
                group
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.02]
                p-5
                transition-all
                duration-300
                hover:border-[#C97B3C]/25
                hover:bg-[#C97B3C]/5
              "
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Job Information */}

                <div className="flex min-w-0 items-start gap-4">
                  <div
                    className="
                      flex
                      h-12
                      w-12
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
                    <h3 className="truncate text-lg font-semibold text-white">
                      {job.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                      {job.company && (
                        <span className="flex items-center gap-2">
                          <FaBuilding />
                          {job.company}
                        </span>
                      )}

                      {job.location && (
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt />
                          {job.location}
                        </span>
                      )}

                      {job.package && <span>{formatPackage(job.package)}</span>}
                    </div>
                  </div>
                </div>

                {/* Match + Action */}

                <div className="flex shrink-0 items-center gap-4">
                  {job.matchPercentage > 0 && (
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Match
                      </p>

                      <p className="mt-1 text-lg font-bold text-[#F4C27A]">
                        {job.matchPercentage}%
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => router.push(`/jobs/${job._id}`)}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-[#C97B3C]
                      px-5
                      py-2.5
                      font-semibold
                      text-black
                      transition
                      hover:bg-[#F4C27A]
                    "
                  >
                    View
                    <FaArrowRight />
                  </button>
                </div>
              </div>

              {/* Matched Skills */}

              {job.matchedSkills?.length > 0 && (
                <div className="mt-5 border-t border-white/[0.05] pt-4">
                  <p className="mb-3 text-xs uppercase tracking-wider text-gray-500">
                    Matching Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.matchedSkills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="
                            rounded-full
                            border
                            border-green-500/20
                            bg-green-500/10
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-green-400
                          "
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mobile View All */}

      {jobs.length > 0 && (
        <button
          onClick={() => router.push("/jobs")}
          className="
            mt-6
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[#F4C27A]
            transition
            hover:gap-3
            sm:hidden
          "
        >
          View all jobs
          <FaArrowRight />
        </button>
      )}
    </GlassCard>
  );
}

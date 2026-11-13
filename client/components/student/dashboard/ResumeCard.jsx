"use client";

import { FaArrowRight, FaFileAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

import GlassCard from "@/components/ui/GlassCard";

export default function ResumeCard({ profile }) {
  const router = useRouter();

  const resume = profile?.resume;

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
            <FaFileAlt />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C97B3C]">
              RESUME
            </p>

            <h2 className="text-2xl font-bold text-white">Your Resume</h2>
          </div>
        </div>

        <button
          onClick={() => router.push("/profile")}
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
          Manage
          <FaArrowRight />
        </button>
      </div>

      {/* Resume Uploaded */}

      {resume?.url ? (
        <div
          className="
            rounded-2xl
            border
            border-[#C97B3C]/20
            bg-[#C97B3C]/5
            p-6
          "
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Resume Details */}

            <div className="flex min-w-0 items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#C97B3C]/15
                  text-2xl
                  text-[#F4C27A]
                "
              >
                <FaFileAlt />
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-white">
                  {resume.originalName || "Resume"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Uploaded{" "}
                  {resume.uploadedAt
                    ? new Date(resume.uploadedAt).toLocaleDateString()
                    : "recently"}
                </p>
              </div>
            </div>

            {/* Actions */}

            <div className="flex flex-wrap gap-3">
              <a
                href={resume.url}
                target="_blank"
                rel="noreferrer"
                className="
                  rounded-xl
                  border
                  border-[#C97B3C]/30
                  bg-[#C97B3C]/10
                  px-5
                  py-2.5
                  font-semibold
                  text-[#F4C27A]
                  transition
                  hover:bg-[#C97B3C]/20
                "
              >
                View Resume
              </a>

              <a
                href={resume.url}
                download={resume.originalName}
                className="
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
                Download
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Resume Not Uploaded */

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-[#C97B3C]/20
            bg-white/[0.02]
            p-8
          "
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#C97B3C]/10
                text-2xl
                text-[#F4C27A]
              "
            >
              <FaFileAlt />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-white">Resume not uploaded</h3>

              <p className="mt-1 text-sm text-gray-500">
                Upload your latest resume to improve your placement chances.
              </p>
            </div>

            <button
              onClick={() => router.push("/profile")}
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
              Upload Resume
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

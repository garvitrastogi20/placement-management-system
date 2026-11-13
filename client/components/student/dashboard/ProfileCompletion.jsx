"use client";

import { FaUserCheck } from "react-icons/fa";
import Link from "next/link";

export default function ProfileCompletion({ profile, completion }){
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[#C97B3C]/20
        bg-[#11100F]
        p-6
        shadow-[0_15px_50px_rgba(0,0,0,.25)]
        sm:p-7
      "
    >
      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-[#C97B3C]/10
          blur-[80px]
        "
      />

      <div className="relative z-10">
        {/* Header */}

        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#C97B3C]/20
                bg-[#C97B3C]/10
                text-[#F4C27A]
              "
            >
              <FaUserCheck />
            </div>

            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#C97B3C]
                "
              >
                Profile Strength
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Profile Completion
              </h2>
            </div>
          </div>

          {/* Percentage */}

          <div className="text-right">
            <p className="text-3xl font-extrabold text-[#F4C27A]">
              {completion}%
            </p>

            <p className="mt-1 text-xs text-gray-500">Profile Strength</p>
          </div>
        </div>

        {/* Description */}

        <p className="mt-5 text-sm text-gray-500">
          Complete your profile to improve your placement opportunities.
        </p>

        {/* Progress bar */}

        <div className="mt-6">
          <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-[#C97B3C]
                to-[#F4C27A]
                transition-all
                duration-700
              "
              style={{
                width: `${completion}%`,
              }}
            />
          </div>
        </div>

        {/* Action */}

        {completion < 100 && (
          <Link
            href="/profile"
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              font-semibold
              text-[#F4C27A]
              transition
              hover:text-white
            "
          >
            Complete your profile
            <span>→</span>
          </Link>
        )}

        {completion === 100 && (
          <p className="mt-5 font-semibold text-[#F4C27A]">
            Profile completed ✓
          </p>
        )}
      </div>
    </div>
  );
}

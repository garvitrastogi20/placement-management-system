"use client";

import { FaArrowRight, FaCode } from "react-icons/fa";
import { useRouter } from "next/navigation";

import GlassCard from "@/components/ui/GlassCard";

export default function SkillsCard({ profile }) {
  const router = useRouter();

  const skills = profile?.skills || [];

  return (
    <GlassCard>
      {/* Header */}

      <div className="mb-7 flex items-center gap-3">
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
          <FaCode />
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#C97B3C]">
            SKILLS
          </p>

          <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
        </div>
      </div>

      {/* Skills */}

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="
                rounded-full
                border
                border-[#C97B3C]/30
                bg-[#C97B3C]/10
                px-4
                py-2
                text-sm
                font-medium
                text-[#F4C27A]
                transition
                hover:border-[#F4C27A]/40
                hover:bg-[#C97B3C]/20
              "
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6">
          <p className="text-gray-500">No skills added yet.</p>
        </div>
      )}

      {/* Manage Skills */}

      <button
        onClick={() => router.push("/profile")}
        className="
          mt-6
          flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-[#F4C27A]
          transition-all
          hover:gap-3
        "
      >
        Manage skills
        <FaArrowRight />
      </button>
    </GlassCard>
  );
}

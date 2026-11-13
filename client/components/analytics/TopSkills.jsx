"use client";

import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";

export default function TopSkills({ skills = [] }) {
  if (!skills.length) {
    return (
      <GlassCard>
        <SectionHeader
          title="Top Required Skills"
          subtitle="Most frequently requested technologies."
        />

        <div className="flex h-56 items-center justify-center text-gray-500">
          No skills available.
        </div>
      </GlassCard>
    );
  }

  const maxCount = Math.max(...skills.map((s) => s.count));

  return (
    <GlassCard>
      <SectionHeader
        title="Top Required Skills"
        subtitle="Technologies recruiters are demanding the most."
      />

      <div className="space-y-5">
        {skills.map((item, index) => (
          <div
            key={item.skill}
            className="
              rounded-2xl
              border
              border-white/5
              bg-white/[0.02]
              p-4
              transition-all
              duration-300
              hover:border-[#C97B3C]/25
            "
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#C97B3C]/10
                    font-bold
                    text-[#F4C27A]
                  "
                >
                  #{index + 1}
                </div>

                <div>
                  <h3 className="font-semibold text-white">{item.skill}</h3>

                  <p className="text-sm text-gray-500">
                    Used in {item.count} jobs
                  </p>
                </div>
              </div>

              <span className="text-[#F4C27A] font-bold">{item.count}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C97B3C] to-[#F4C27A]"
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

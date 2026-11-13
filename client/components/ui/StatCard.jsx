"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

export default function StatCard({
  title,
  value,
  icon,
  color = "text-[#F4C27A]",
  subtitle,
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <GlassCard>
        <div className="flex items-center justify-between gap-5">
          {/* Content */}

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              {title}
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
              {value}
            </h2>

            {subtitle && (
              <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>

          {/* Icon */}

          <div
            className={`
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-[#C97B3C]/20
              bg-gradient-to-br
              from-[#C97B3C]/20
              to-[#F4C27A]/10
              text-2xl
              shadow-[0_8px_25px_rgba(201,123,60,.08)]
              ${color}
            `}
          >
            {icon}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

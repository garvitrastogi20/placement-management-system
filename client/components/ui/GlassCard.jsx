"use client";

import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`
        rounded-3xl
        border
        border-slate-200/80
        bg-white/90
        text-slate-900
        p-6
        shadow-[0_10px_30px_rgba(0,0,0,0.06)]
        backdrop-blur-xl
        transition-colors
        duration-200
        dark:border-[#C97B3C]/20
        dark:bg-[#11100F]
        dark:text-white
        dark:shadow-[0_15px_50px_rgba(0,0,0,0.25)]
        sm:p-7
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

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
        border-[#C97B3C]/20
        bg-[#11100F]
        p-6
        shadow-[0_15px_50px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
        sm:p-7
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

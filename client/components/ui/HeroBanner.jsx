"use client";

import { motion } from "framer-motion";
import GradientButton from "./GradientButton";
import { Sparkles } from "lucide-react";

export default function HeroBanner({ title, subtitle, buttonText, onClick }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-200
        bg-gradient-to-br
        from-slate-100
        via-white
        to-slate-50
        p-6
        sm:p-10
        shadow-[0_15px_40px_rgba(0,0,0,.08)]
        transition-colors
        duration-200
        dark:border-white/10
        dark:from-[#1A1613]
        dark:via-[#121212]
        dark:to-[#09090B]
        dark:shadow-[0_25px_80px_rgba(0,0,0,.45)]
      "
    >
      {/* Copper Glow */}

      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-400/15 blur-[120px] dark:bg-[#C97B3C]/20" />

      {/* Gold Glow */}

      <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-indigo-300/15 blur-[120px] dark:bg-[#F4C27A]/10" />

      {/* Decorative Ring */}

      <div
        className="
          absolute
          right-12
          top-8
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          border
          border-blue-500/20
          bg-blue-500/10
          dark:border-[#C97B3C]/20
          dark:bg-[#C97B3C]/10
        "
      >
        <Sparkles size={34} className="text-blue-600 dark:text-[#F4C27A]" />
      </div>

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_240px] lg:items-center">
        {/* Left Content */}

        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-blue-600 dark:text-[#C97B3C]">
            PLACEMENT AI
          </p>

          <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
            {title}
          </h1>

          <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-slate-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Right CTA */}

        {buttonText && (
          <div className="flex items-end justify-center pt-10 lg:justify-end lg:pt-14">
            <GradientButton
              onClick={onClick}
              className="px-9 py-4 text-lg whitespace-nowrap"
            >
              {buttonText}
            </GradientButton>
          </div>
        )}
      </div>
    </motion.div>
  );
}

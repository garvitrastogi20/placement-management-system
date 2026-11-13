"use client";

import { Inbox } from "lucide-react";
import GradientButton from "./GradientButton";

export default function EmptyState({ title, subtitle, buttonText, onClick }) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-200
        bg-white
        px-6
        sm:px-8
        py-14
        sm:py-20
        text-center
        shadow-[0_10px_30px_rgba(0,0,0,.06)]
        transition-colors
        duration-200
        dark:border-[#C97B3C]/20
        dark:bg-gradient-to-br
        dark:from-[#171412]
        dark:via-[#111111]
        dark:to-[#09090B]
        dark:shadow-[0_20px_70px_rgba(0,0,0,.45)]
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          left-1/2
          top-0
          h-60
          w-60
          -translate-x-1/2
          rounded-full
          bg-blue-400/10
          blur-[120px]
          dark:bg-[#C97B3C]/10
        "
      />

      <div className="relative z-10">
        <div
          className="
            mx-auto
            flex
            h-20
            w-20
            sm:h-24
            sm:w-24
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
          <Inbox size={38} className="text-blue-600 dark:text-[#F4C27A]" />
        </div>

        <h2 className="mt-6 sm:mt-8 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-slate-600 dark:text-gray-400">
          {subtitle}
        </p>

        {buttonText && (
          <div className="mt-8 sm:mt-10">
            <GradientButton onClick={onClick}>{buttonText}</GradientButton>
          </div>
        )}
      </div>
    </div>
  );
}

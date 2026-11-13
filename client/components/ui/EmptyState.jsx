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
                border-[#C97B3C]/20
                bg-gradient-to-br
                from-[#171412]
                via-[#111111]
                to-[#09090B]
                px-8
                py-20
                text-center
                shadow-[0_20px_70px_rgba(0,0,0,.45)]
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
                    bg-[#C97B3C]/10
                    blur-[120px]
                "
      />

      <div className="relative z-10">
        <div
          className="
                        mx-auto
                        flex
                        h-24
                        w-24
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#C97B3C]/20
                        bg-[#C97B3C]/10
                    "
        >
          <Inbox size={42} className="text-[#F4C27A]" />
        </div>

        <h2 className="mt-8 text-3xl font-bold text-white">{title}</h2>

        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-400">
          {subtitle}
        </p>

        {buttonText && (
          <div className="mt-10">
            <GradientButton onClick={onClick}>{buttonText}</GradientButton>
          </div>
        )}
      </div>
    </div>
  );
}

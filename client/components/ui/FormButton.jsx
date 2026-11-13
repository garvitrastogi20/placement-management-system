"use client";

import { LoaderCircle } from "lucide-react";

export default function FormButton({
  children,
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading}
      className={`
                group
                relative
                flex
                w-full
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                bg-[#C97B3C]
                px-6
                py-4
                text-lg
                font-semibold
                text-black
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#F4C27A]
                hover:shadow-[0_12px_35px_rgba(201,123,60,.35)]
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:translate-y-0
                ${className}
            `}
    >
      {/* Button Glow */}

      <span
        className="
                    absolute
                    inset-0
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                    bg-[radial-gradient(circle_at_center,rgba(255,255,255,.18),transparent_70%)]
                "
      />

      <span className="relative z-10 flex items-center gap-3">
        {loading ? (
          <>
            <LoaderCircle size={22} className="animate-spin" />
            Publishing Job...
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}

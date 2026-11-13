"use client";

import { motion } from "framer-motion";

export default function GradientButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{
        scale: 1.03,
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      {...props}
      className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-[#C97B3C]
                to-[#F4C27A]
                px-7
                py-3.5
                font-semibold
                text-black
                shadow-[0_10px_30px_rgba(201,123,60,.25)]
                transition-all
                duration-300
                hover:shadow-[0_15px_40px_rgba(201,123,60,.4)]
                ${className}
            `}
    >
      {/* Shine */}

      <span
        className="
                    absolute
                    inset-0
                    -translate-x-full
                    bg-gradient-to-r
                    from-transparent
                    via-white/20
                    to-transparent
                    transition-transform
                    duration-700
                    group-hover:translate-x-full
                "
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

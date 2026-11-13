"use client";

import { FaArrowRight, FaBriefcase,FaStar } from "react-icons/fa";

export default function Hero({ profile }) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <section
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[#C97B3C]/20
        bg-[#11100F]
        p-8
        shadow-[0_20px_70px_rgba(0,0,0,.35)]
        sm:p-10
      "
    >
      {/* ========================================= */}
      {/* Background Glow */}
      {/* ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-72
          w-72
          rounded-full
          bg-[#C97B3C]/15
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          left-1/3
          h-64
          w-64
          rounded-full
          bg-[#F4C27A]/5
          blur-[100px]
        "
      />

      {/* Subtle border glow */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-3xl
          bg-gradient-to-br
          from-[#C97B3C]/[0.04]
          via-transparent
          to-[#F4C27A]/[0.03]
        "
      />

      {/* ========================================= */}
      {/* Content */}
      {/* ========================================= */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-start
          justify-between
          gap-8
          lg:flex-row
          lg:items-center
        "
      >
        {/* Left */}

        <div className="max-w-3xl">
          {/* Label */}

          <div className="mb-5 flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-[#C97B3C]/25
                bg-[#C97B3C]/10
                text-[#F4C27A]
              "
            >
              <FaStar />
            </div>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#C97B3C]
              "
            >
              Placement AI
            </p>
          </div>

          {/* Greeting */}

          <p className="text-lg font-medium text-gray-400">{greeting}</p>

          {/* Name */}

          <h1
            className="
              mt-2
              text-4xl
              font-extrabold
              tracking-tight
              text-white
              sm:text-5xl
            "
          >
            {profile?.user?.name || "Student"}
            <span className="ml-3">👋</span>
          </h1>

          {/* Description */}

          <p
            className="
              mt-4
              max-w-2xl
              text-base
              leading-7
              text-gray-500
              sm:text-lg
            "
          >
            Welcome back! Continue your placement journey and discover
            opportunities that match your skills.
          </p>
        </div>

        {/* ========================================= */}
        {/* Browse Jobs */}
        {/* ========================================= */}

        <button
          type="button"
          onClick={() => {
            window.location.href = "/jobs";
          }}
          className="
            group/button
            flex
            shrink-0
            items-center
            gap-3
            rounded-2xl
            border
            border-[#C97B3C]/30
            bg-gradient-to-r
            from-[#C97B3C]
            to-[#D99450]
            px-7
            py-4
            font-semibold
            text-black
            shadow-[0_10px_30px_rgba(201,123,60,.15)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_15px_40px_rgba(201,123,60,.25)]
            hover:from-[#F4C27A]
            hover:to-[#E7A765]
          "
        >
          <FaBriefcase />

          <span>Browse Jobs</span>

          <FaArrowRight
            className="
              text-sm
              transition-transform
              duration-300
              group-hover/button:translate-x-1
            "
          />
        </button>
      </div>

      {/* ========================================= */}
      {/* Bottom Accent */}
      {/* ========================================= */}

      <div
        className="
          absolute
          bottom-0
          left-8
          right-8
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#C97B3C]/40
          to-transparent
        "
      />
    </section>
  );
}

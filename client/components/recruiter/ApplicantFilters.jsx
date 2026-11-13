"use client";

import { Search } from "lucide-react";

const STATUS = ["All", "Applied", "Shortlisted", "Selected", "Rejected"];

export default function ApplicantFilters({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="space-y-6">
      {/* Search */}

      <div className="relative">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C97B3C]"
        />

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            py-4
            pl-14
            pr-5
            text-white
            outline-none
            transition-all
            duration-300
            placeholder:text-gray-500
            focus:border-[#C97B3C]
            focus:ring-2
            focus:ring-[#C97B3C]/30
          "
        />
      </div>

      {/* Status Filter */}

      <div className="flex flex-wrap gap-3">
        {STATUS.map((item) => {
          const active = status === item;

          return (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={`
                rounded-xl
                px-5
                py-2.5
                text-sm
                font-medium
                transition-all
                duration-300

                ${
                  active
                    ? `
                      bg-gradient-to-r
                      from-[#C97B3C]
                      to-[#F4C27A]
                      text-black
                      shadow-[0_10px_25px_rgba(201,123,60,.30)]
                    `
                    : `
                      border
                      border-white/10
                      bg-white/[0.04]
                      text-gray-400
                      hover:border-[#C97B3C]/40
                      hover:text-[#F4C27A]
                    `
                }
              `}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

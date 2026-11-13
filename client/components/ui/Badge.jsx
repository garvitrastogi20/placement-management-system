"use client";

export default function Badge({ color = "amber", children }) {
  const styles = {
    amber: "bg-[#C97B3C]/15 text-[#F4C27A] border-[#C97B3C]/30",

    green: "bg-green-500/15 text-green-300 border-green-500/30",

    red: "bg-red-500/15 text-red-300 border-red-500/30",

    blue: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  };

  return (
    <span
      className={`
                inline-flex
                items-center
                rounded-full
                border
                px-4
                py-1.5
                text-sm
                font-medium
                ${styles[color]}
            `}
    >
      {children}
    </span>
  );
}

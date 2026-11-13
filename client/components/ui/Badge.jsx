"use client";

export default function Badge({ color, variant, children, className = "" }) {
  const resolved = variant || color || "amber";
  const styles = {
    amber: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-[#C97B3C]/15 dark:text-[#F4C27A] dark:border-[#C97B3C]/30",
    warning: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-[#C97B3C]/15 dark:text-[#F4C27A] dark:border-[#C97B3C]/30",
    green: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30",
    success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30",
    red: "bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
    danger: "bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
    blue: "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30",
    info: "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30",
  };

  const badgeStyle = styles[resolved] || styles.amber;

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3.5
        py-1
        text-xs
        font-semibold
        ${badgeStyle}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

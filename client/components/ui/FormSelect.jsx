"use client";

export default function FormSelect({ label, children, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#F4C27A]">{label}</label>

      <select
        {...props}
        className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-5
                    py-3
                    text-white
                    outline-none
                    transition
                    focus:border-[#C97B3C]
                    focus:ring-2
                    focus:ring-[#C97B3C]/30
                "
      >
        {children}
      </select>
    </div>
  );
}

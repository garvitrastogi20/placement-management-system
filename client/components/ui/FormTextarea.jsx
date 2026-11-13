"use client";

export default function FormTextarea({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#F4C27A]">
        {label}
      </label>

      <textarea
        {...props}
        className="
                    min-h-40
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-5
                    py-3
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
  );
}

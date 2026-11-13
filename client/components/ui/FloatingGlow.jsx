"use client";

export default function FloatingGlow() {
  return (
    <>
      <div
        className="
                    absolute
                    top-20
                    right-10
                    h-72
                    w-72
                    rounded-full
                    bg-[#C97B3C]/10
                    blur-[120px]
                "
      />

      <div
        className="
                    absolute
                    bottom-10
                    left-10
                    h-80
                    w-80
                    rounded-full
                    bg-[#F4C27A]/5
                    blur-[120px]
                "
      />
    </>
  );
}

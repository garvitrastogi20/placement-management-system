"use client";

import Image from "next/image";

export default function ApplicantAvatar({ name, image, size = "lg" }) {
  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-xl",
    xl: "h-20 w-20 text-2xl",
  };

  const pixelSizes = {
    sm: 40,
    md: 48,
    lg: 64,
    xl: 80,
  };

  if (image) {
    const dimension = pixelSizes[size] || 64;

    return (
      <Image
        src={image}
        alt={name || "Applicant"}
        width={dimension}
        height={dimension}
        unoptimized
        className={`
          ${sizes[size]}
          rounded-full
          border
          border-[#C97B3C]/20
          object-cover
        `}
      />
    );
  }

  return (
    <div
      className={`
        ${sizes[size]}
        flex
        items-center
        justify-center
        rounded-full
        bg-gradient-to-br
        from-[#C97B3C]
        to-[#F4C27A]
        font-bold
        text-black
        shadow-[0_10px_30px_rgba(201,123,60,.25)]
      `}
    >
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

"use client";

import { Sparkles } from "lucide-react";

export default function AIInfoCard({
  title,

  description,
}) {
  return (
    <div
      className="
                rounded-3xl
                border
                border-[#C97B3C]/20
                bg-[#C97B3C]/5
                p-6
            "
    >
      <div className="flex gap-4">
        <Sparkles className="text-[#F4C27A]" />

        <div>
          <h3 className="font-bold text-[#F4C27A]">{title}</h3>

          <p className="mt-2 text-gray-300 leading-7">{description}</p>
        </div>
      </div>
    </div>
  );
}

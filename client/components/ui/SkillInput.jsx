"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function SkillInput({
  skills,
  setSkills,
  placeholder = "Type a skill and press Enter",
}) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const value = input.trim();

    if (!value) return;

    if (skills.includes(value)) {
      setInput("");
      return;
    }

    setSkills([...skills, value]);
    setInput("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <div
      className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-4
                transition
                focus-within:border-[#C97B3C]
                focus-within:ring-2
                focus-within:ring-[#C97B3C]/30
            "
    >
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div
            key={skill}
            className="
                            flex
                            items-center
                            gap-2
                            rounded-full
                            bg-[#C97B3C]/20
                            px-4
                            py-2
                            text-sm
                            text-[#F4C27A]
                        "
          >
            {skill}

            <button type="button" onClick={() => removeSkill(skill)}>
              <X size={15} />
            </button>
          </div>
        ))}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder={placeholder}
          className="
                        min-w-[200px]
                        flex-1
                        bg-transparent
                        outline-none
                        text-white
                        placeholder:text-gray-500
                    "
        />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FaPlusCircle, FaBriefcase, FaUsers, FaChartBar } from "react-icons/fa";

import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";

const actions = [
  {
    title: "Create Job",
    description: "Post a new job opening",
    href: "/recruiter/create-job",
    icon: <FaPlusCircle />,
    color: "text-[#C97B3C]",
  },
  {
    title: "Manage Jobs",
    description: "View and edit posted jobs",
    href: "/recruiter/jobs",
    icon: <FaBriefcase />,
    color: "text-green-400",
  },
  {
    title: "Applicants",
    description: "Review job applicants",
    href: "/recruiter/applicants",
    icon: <FaUsers />,
    color: "text-purple-400",
  },
  {
    title: "Analytics",
    description: "View hiring insights",
    href: "/recruiter/analytics",
    icon: <FaChartBar />,
    color: "text-orange-400",
  },
];

export default function QuickActions() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Quick Actions"
        subtitle="Navigate quickly to your most frequently used recruiter tools."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {actions.map((action) => (
          <GlassCard key={action.title} className="p-0 h-full">
            <Link
              href={action.href}
              className="
                group
                flex
                h-full
                flex-col
                p-6
              "
            >
              <div
                className={`
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#C97B3C]/20
                  bg-gradient-to-br
                  from-[#C97B3C]/20
                  to-[#F4C27A]/10
                  text-3xl
                  ${action.color}
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:rotate-6
                `}
              >
                {action.icon}
              </div>

              <h3 className="text-xl font-bold text-white">{action.title}</h3>

              <p className="mt-3 text-gray-400 leading-7">
                {action.description}
              </p>

              <div className="mt-auto pt-6">
                <span
                  className="
                    text-sm
                    font-semibold
                    text-[#C97B3C]
                    transition-all
                    duration-300
                    group-hover:translate-x-2
                    inline-block
                  "
                >
                  Open →
                </span>
              </div>
            </Link>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

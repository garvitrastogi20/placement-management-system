"use client";

import Link from "next/link";
import {
  FaPlusCircle,
  FaBriefcase,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";

const actions = [
  {
    title: "Create Job",
    description: "Post a new job opening",
    href: "/recruiter/create-job",
    icon: <FaPlusCircle />,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Manage Jobs",
    description: "View and edit posted jobs",
    href: "/recruiter/jobs",
    icon: <FaBriefcase />,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Applicants",
    description: "Review job applicants",
    href: "/recruiter/applicants",
    icon: <FaUsers />,
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Analytics",
    description: "View hiring insights",
    href: "/recruiter/analytics",
    icon: <FaChartBar />,
    color: "from-orange-500 to-red-500",
  },
];

export default function QuickActions() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        Quick Actions
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl"
          >
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-2xl text-white`}
            >
              {action.icon}
            </div>

            <h3 className="text-lg font-semibold text-white">
              {action.title}
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBrain } from "react-icons/fa";

import Logo from "../common/Logo";

import {
  FaHome,
  FaBriefcase,
  FaFileAlt,
  FaUser,
  FaSignOutAlt,
  FaChartLine,
  FaCog,
  FaChevronRight,
} from "react-icons/fa";

const MENU_ITEMS = [
  {
    title: "Dashboard",
    icon: FaHome,
    href: "/dashboard",
  },
  {
    title: "Jobs",
    icon: FaBriefcase,
    href: "/jobs",
  },
  {
    title: "Applications",
    icon: FaFileAlt,
    href: "/my-applications",
  },
  {
    title: "Profile",
    icon: FaUser,
    href: "/profile",
  },
  {
    title: "Analytics",
    icon: FaChartLine,
    href: "/analytics",
  },
  {
    title: "AI Resume Analyzer",
    icon: FaBrain,
    href: "/resume-analyzer",
  },
  {
    title: "Settings",
    icon: FaCog,
    href: "/settings",
  },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState({
    name: "Student",
    role: "student",
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // Require authentication.
    if (!token) {
      router.replace("/login");
      return;
    }

    // Prevent recruiters from accessing student pages.
    if (role === "recruiter") {
      router.replace("/recruiter/dashboard");
      return;
    }

    setUser({
      name: localStorage.getItem("name") || "Student",
      role: role || "student",
    });

    setMounted(true);
  }, [router]);

  const isActiveRoute = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("recruiterProfileImage");

    router.replace("/login");
  };

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-[#C97B3C]/15 bg-[#090807]/95 text-white backdrop-blur-2xl">
      {/* Logo */}
      <div className="relative shrink-0 overflow-hidden border-b border-[#C97B3C]/15 p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C97B3C]/10 blur-[70px]" />

        <div className="relative z-10">
          <Logo />
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Student navigation"
        className="flex-1 overflow-y-auto p-5"
      >
        <p className="mb-4 px-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C97B3C]">
          Student Portal
        </p>

        <div className="space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  group relative flex items-center gap-4
                  overflow-hidden rounded-2xl border px-4 py-3.5
                  transition-all duration-300
                  ${
                    isActive
                      ? "border-[#C97B3C]/30 bg-gradient-to-r from-[#C97B3C]/20 via-[#C97B3C]/10 to-transparent text-[#F4C27A] shadow-[0_8px_30px_rgba(201,123,60,.08)]"
                      : "border-transparent text-gray-400 hover:border-[#C97B3C]/15 hover:bg-[#C97B3C]/5 hover:text-gray-200"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#C97B3C] to-[#F4C27A]" />
                )}

                <span
                  className={`
                    relative z-10 flex h-9 w-9 shrink-0 items-center
                    justify-center rounded-xl text-base
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-[#C97B3C]/15 text-[#F4C27A]"
                        : "bg-white/[0.03] text-gray-500 group-hover:bg-[#C97B3C]/10 group-hover:text-[#F4C27A]"
                    }
                  `}
                >
                  <Icon />
                </span>

                <span className="relative z-10 flex-1 font-medium">
                  {item.title}
                </span>

                <FaChevronRight
                  className={`
                    shrink-0 text-xs transition-all duration-300
                    ${
                      isActive
                        ? "translate-x-0 text-[#C97B3C] opacity-100"
                        : "-translate-x-1 text-gray-700 opacity-0 group-hover:translate-x-0 group-hover:text-[#C97B3C] group-hover:opacity-100"
                    }
                  `}
                />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="shrink-0 border-t border-[#C97B3C]/15 p-5">
        <Link
          href="/profile"
          className="mb-4 block rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-[#C97B3C]/20 hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C97B3C] to-[#F4C27A] text-sm font-extrabold text-black shadow-[0_8px_25px_rgba(201,123,60,.15)]">
              {mounted ? initials || "S" : "S"}

              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#111111] bg-green-500" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-white">
                {mounted ? user.name : "Student"}
              </h3>

              <p className="mt-0.5 text-xs capitalize text-gray-500">
                {user.role}
              </p>
            </div>

            <FaChevronRight className="shrink-0 text-xs text-gray-600" />
          </div>
        </Link>

        <button
          type="button"
          onClick={logout}
          className="group w-full rounded-2xl border border-red-500/15 bg-red-500/[0.04] px-4 py-3 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10"
        >
          <div className="flex items-center justify-center gap-3 text-sm font-semibold text-red-400">
            <FaSignOutAlt className="transition-transform duration-300 group-hover:-translate-x-0.5" />
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
}

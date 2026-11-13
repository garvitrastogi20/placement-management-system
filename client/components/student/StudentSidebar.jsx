"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBrain, FaRobot } from "react-icons/fa";

import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";

import {
  FaHome,
  FaBriefcase,
  FaFileAlt,
  FaUser,
  FaSignOutAlt,
  FaChartLine,
  FaCog,
  FaChevronRight,
  FaBars,
  FaTimes,
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
    title: "Interview Prep",
    icon: FaRobot,
    href: "/interview-preparation",
  },
  {
    title: "Mock Interview",
    icon: FaRobot,
    href: "/mock-interview",
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
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
    <>
      {/* Mobile Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-[#C97B3C]/15 dark:bg-[#090807]/95 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 transition dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
          >
            {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
          <Logo />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white text-slate-900 transition-transform duration-300 dark:border-[#C97B3C]/15 dark:bg-[#090807]/95 dark:text-white backdrop-blur-2xl ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="relative shrink-0 overflow-hidden border-b border-slate-200 p-6 dark:border-[#C97B3C]/15 sm:p-7">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/10 blur-[70px] dark:bg-[#C97B3C]/10" />

          <div className="relative z-10 flex items-center justify-between">
            <Logo />
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Student navigation"
          className="flex-1 overflow-y-auto p-4 sm:p-5"
        >
          <p className="mb-4 px-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-[#C97B3C]">
            Student Portal
          </p>

          <div className="space-y-1.5">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    group relative flex items-center gap-3.5
                    overflow-hidden rounded-2xl border px-3.5 py-3
                    transition-all duration-300
                    ${
                      isActive
                        ? "border-blue-500/30 bg-blue-50 text-blue-700 shadow-sm dark:border-[#C97B3C]/30 dark:bg-gradient-to-r dark:from-[#C97B3C]/20 dark:via-[#C97B3C]/10 dark:to-transparent dark:text-[#F4C27A] dark:shadow-[0_8px_30px_rgba(201,123,60,.08)]"
                        : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 dark:text-gray-400 dark:hover:border-[#C97B3C]/15 dark:hover:bg-[#C97B3C]/5 dark:hover:text-gray-200"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 dark:bg-gradient-to-b dark:from-[#C97B3C] dark:to-[#F4C27A]" />
                  )}

                  <span
                    className={`
                      relative z-10 flex h-9 w-9 shrink-0 items-center
                      justify-center rounded-xl text-base
                      transition-all duration-300
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-[#C97B3C]/15 dark:text-[#F4C27A]"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-white/[0.03] dark:text-gray-500 dark:group-hover:bg-[#C97B3C]/10 dark:group-hover:text-[#F4C27A]"
                      }
                    `}
                  >
                    <Icon />
                  </span>

                  <span className="relative z-10 flex-1 font-medium text-sm">
                    {item.title}
                  </span>

                  <FaChevronRight
                    className={`
                      shrink-0 text-xs transition-all duration-300
                      ${
                        isActive
                          ? "translate-x-0 text-blue-600 opacity-100 dark:text-[#C97B3C]"
                          : "-translate-x-1 text-slate-400 opacity-0 group-hover:translate-x-0 group-hover:text-blue-600 dark:text-gray-700 dark:group-hover:text-[#C97B3C] group-hover:opacity-100"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="shrink-0 border-t border-slate-200 p-4 dark:border-[#C97B3C]/15 sm:p-5">
          <Link
            href="/profile"
            className="mb-3 block rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-slate-300 hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.025] dark:hover:border-[#C97B3C]/20 dark:hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-extrabold text-white shadow-sm dark:from-[#C97B3C] dark:to-[#F4C27A] dark:text-black dark:shadow-[0_8px_25px_rgba(201,123,60,.15)]">
                {mounted ? initials || "S" : "S"}

                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-[#111111]" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-slate-900 dark:text-white text-sm">
                  {mounted ? user.name : "Student"}
                </h3>

                <p className="mt-0.5 text-xs capitalize text-slate-500 dark:text-gray-500">
                  {user.role}
                </p>
              </div>

              <FaChevronRight className="shrink-0 text-xs text-slate-400 dark:text-gray-600" />
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="group w-full rounded-2xl border border-red-500/15 bg-red-500/[0.04] px-4 py-2.5 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10"
          >
            <div className="flex items-center justify-center gap-2.5 text-sm font-semibold text-red-600 dark:text-red-400">
              <FaSignOutAlt className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              Logout
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

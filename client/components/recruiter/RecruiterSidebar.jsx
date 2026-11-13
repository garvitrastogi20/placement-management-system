"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";

import {
  FaHome,
  FaBriefcase,
  FaPlusCircle,
  FaUsers,
  FaChartLine,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaCamera,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function RecruiterSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    role: "",
    profileImage: "",
  });

  // Load recruiter information
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Require authentication
    if (!token) {
      router.replace("/login");
      return;
    }

    // Prevent non-recruiters from accessing recruiter pages
    if (role !== "recruiter") {
      router.replace("/dashboard");
      return;
    }

    setUser({
      name: localStorage.getItem("name") || "Recruiter",
      role,
      profileImage: localStorage.getItem("recruiterProfileImage") || "",
    });
  }, [router]);

  // Listen for profile changes
  useEffect(() => {
    const handleProfileUpdate = () => {
      setUser((prev) => ({
        ...prev,
        name: localStorage.getItem("name") || prev.name,
        profileImage: localStorage.getItem("recruiterProfileImage") || "",
      }));
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const menu = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      href: "/recruiter/dashboard",
    },
    {
      title: "Jobs",
      icon: <FaBriefcase />,
      href: "/recruiter/jobs",
    },
    {
      title: "Create Job",
      icon: <FaPlusCircle />,
      href: "/recruiter/create-job",
    },
    {
      title: "Applicants",
      icon: <FaUsers />,
      href: "/recruiter/applicants",
    },
    {
      title: "Analytics",
      icon: <FaChartLine />,
      href: "/recruiter/analytics",
    },
    {
      title: "Profile",
      icon: <FaUser />,
      href: "/recruiter/profile",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      href: "/recruiter/settings",
    },
  ];

  const logout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  const openProfile = () => {
    router.push("/recruiter/profile");
  };

  const getInitial = () => {
    if (!user.name) return "R";

    return user.name.trim().charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-[#C97B3C]/15 dark:bg-[#090807]/95 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Recruiter Menu"
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

      {/* Main Recruiter Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-40
          h-screen
          w-72
          border-r
          border-slate-200
          bg-white
          text-slate-900
          transition-transform
          duration-300
          dark:border-[#C97B3C]/10
          dark:bg-gradient-to-b
          dark:from-[#14110F]
          dark:via-[#0F0F10]
          dark:to-[#09090B]
          dark:text-white
          backdrop-blur-2xl
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* =====================================================
              LOGO
          ====================================================== */}

          <div className="border-b border-slate-200 p-6 dark:border-[#C97B3C]/10 sm:p-7 flex items-center justify-between">
            <Logo />
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#C97B3C]">
            Main
          </p>

          <div className="space-y-2">
            {menu.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/recruiter/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.title}
                  href={item.disabled ? "#" : item.href}
                  className={`
                    group
                    relative
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    px-5
                    py-4
                    transition-all
                    duration-300

                    ${
                      active
                        ? `
                          bg-gradient-to-r
                          from-[#C97B3C]
                          to-[#F4C27A]
                          text-black
                          shadow-[0_10px_35px_rgba(201,123,60,.35)]
                        `
                        : `
                          text-gray-400
                          hover:bg-[#C97B3C]/10
                          hover:text-[#F4C27A]
                        `
                    }

                    ${item.disabled ? "pointer-events-none opacity-40" : ""}
                  `}
                >
                  {/* Active indicator */}

                  {active && (
                    <div
                      className="
                        absolute
                        left-0
                        h-8
                        w-1
                        rounded-r-full
                        bg-black/70
                      "
                    />
                  )}

                  {/* Icon */}

                  <span
                    className={`
                      text-lg
                      transition-all
                      duration-300
                      ${active ? "text-black" : "group-hover:scale-110"}
                    `}
                  >
                    {item.icon}
                  </span>

                  {/* Title */}

                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            RECRUITER PROFILE CARD
        ====================================================== */}

        <div className="border-t border-[#C97B3C]/10 p-5">
          <button
            type="button"
            onClick={openProfile}
            className="
              group
              mb-5
              flex
              w-full
              items-center
              gap-4
              rounded-2xl
              border
              border-[#C97B3C]/10
              bg-[#C97B3C]/5
              p-4
              text-left
              transition-all
              duration-300
              hover:border-[#C97B3C]/30
              hover:bg-[#C97B3C]/10
            "
          >
            {/* Profile Photo */}

            <div
              className="
                relative
                h-12
                w-12
                shrink-0
                overflow-hidden
                rounded-full
                border
                border-[#C97B3C]/20
                bg-gradient-to-br
                from-[#C97B3C]
                to-[#F4C27A]
              "
            >
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.name || "Recruiter"}
                  width={48}
                  height={48}
                  unoptimized
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    font-bold
                    text-black
                  "
                >
                  {getInitial()}
                </div>
              )}

              {/* Small camera indicator */}

              <div
                className="
                  absolute
                  bottom-0
                  right-0
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-[#14110F]
                  bg-[#F4C27A]
                  text-black
                  opacity-0
                  transition
                  group-hover:opacity-100
                "
              >
                <FaCamera size={8} />
              </div>
            </div>

            {/* Recruiter Information */}

            <div className="min-w-0 flex-1">
              <h3
                className="
                  truncate
                  font-semibold
                  text-white
                  transition-colors
                  duration-300
                  group-hover:text-[#F4C27A]
                "
              >
                {user.name || "Recruiter"}
              </h3>

              <p className="text-sm capitalize text-gray-400">
                {user.role || "Recruiter"}
              </p>
            </div>
          </button>

          {/* ===================================================
              LOGOUT
          ==================================================== */}

          <button
            onClick={logout}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              border
              border-red-500/30
              bg-red-500/10
              py-3
              font-medium
              text-red-400
              transition-all
              duration-300
              hover:bg-red-500/20
            "
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}

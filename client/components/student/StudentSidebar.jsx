"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Logo from "../common/Logo";

import {
  FaHome,
  FaBriefcase,
  FaFileAlt,
  FaUser,
  FaSignOutAlt,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    role: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("role");

    // Prevent recruiters from accessing student pages
    if (role === "recruiter") {
      router.replace("/recruiter/dashboard");
      return;
    }

    setUser({
      name: localStorage.getItem("name") || "Student",
      role: role || "student",
    });
  }, [router]);

  const menu = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      href: "/dashboard",
    },
    {
      title: "Jobs",
      icon: <FaBriefcase />,
      href: "/jobs",
    },
    {
      title: "Applications",
      icon: <FaFileAlt />,
      href: "/my-applications",
    },
    {
      title: "Profile",
      icon: <FaUser />,
      href: "/profile",
    },
    {
      title: "Analytics",
      icon: <FaChartLine />,
      href: "#",
      disabled: true,
    },
    {
      title: "Settings",
      icon: <FaCog />,
      href: "#",
      disabled: true,
    },
  ];

  const logout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r border-white/10 bg-slate-950/90 backdrop-blur-2xl">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-white/10 p-8">
          <Logo />
        </div>

        {/* Menu */}
        <div className="flex-1 space-y-2 p-5">
          {menu.map((item) => (
            <Link
              key={item.title}
              href={item.disabled ? "#" : item.href}
              className={`
                flex items-center gap-4 rounded-2xl px-5 py-4
                transition-all duration-300
                ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
                ${item.disabled ? "pointer-events-none opacity-40" : ""}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          ))}
        </div>

        {/* User */}
        <div className="border-t border-white/10 p-6">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold">
              {user.name.charAt(0)}
            </div>

            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm capitalize text-gray-400">
                {user.role}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full rounded-xl bg-red-600 py-3 transition hover:bg-red-700"
          >
            <div className="flex items-center justify-center gap-3">
              <FaSignOutAlt />
              Logout
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
"use client";

import StudentSidebar from "@/components/student/StudentSidebar";
import Background from "@/components/ui/Background";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#090807] dark:text-white">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="ml-0 lg:ml-72 min-h-screen pt-16 lg:pt-0">
        <Background>{children}</Background>
      </main>
    </div>
  );
}

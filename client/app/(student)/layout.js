"use client";

import StudentSidebar from "@/components/student/StudentSidebar";
import Background from "@/components/ui/Background";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#090807] text-white">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="ml-72 min-h-screen">
        <Background>{children}</Background>
      </main>
    </div>
  );
}

import StudentSidebar from "@/components/student/StudentSidebar";
import Background from "@/components/ui/Background";

export default function StudentLayout({ children }) {
  return (
    <Background>
      <StudentSidebar />

      <main className="ml-72 min-h-screen p-8">
        {children}
      </main>
    </Background>
  );
}
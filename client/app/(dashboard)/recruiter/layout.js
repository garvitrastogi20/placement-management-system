import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";
import Background from "@/components/ui/Background";

export default function RecruiterLayout({ children }) {
  return (
    <Background>
      <RecruiterSidebar />

      <main className="ml-72 min-h-screen p-8">
        {children}
      </main>
    </Background>
  );
}
import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";
import Background from "@/components/ui/Background";

export default function RecruiterLayout({ children }) {
  return (
    <Background>
      <RecruiterSidebar />

      <main className="ml-0 lg:ml-72 min-h-screen p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {children}
      </main>
    </Background>
  );
}
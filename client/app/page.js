import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import Companies from "@/components/landing/Companies";

export default function Home() {
    return (
        <main className="bg-gray-950 text-white min-h-screen">
            <Hero />
            <Stats />
            <Features />
            <Companies />
        </main>
    );
}
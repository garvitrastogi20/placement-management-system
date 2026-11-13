import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import Companies from "@/components/landing/Companies";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import Background from "@/components/ui/Background";

export default function Home() {
    return (
        <Background>
            <Header />
            <main>
                <Hero />
                <div id="stats"><Stats /></div>
                <div id="features"><Features /></div>
                <div id="companies"><Companies /></div>
                <CTA />
            </main>
            <Footer />
        </Background>
    );
}
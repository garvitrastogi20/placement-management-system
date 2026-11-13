import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Placement Portal",
    description: "AI Powered Placement Management System",
};

export default function RootLayout({
    children,
}) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} dark`}
            suppressHydrationWarning
        >
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                const storedTheme = localStorage.getItem('theme');
                                if (storedTheme === 'light') {
                                    document.documentElement.classList.remove('dark');
                                    document.documentElement.classList.add('light');
                                } else {
                                    document.documentElement.classList.remove('light');
                                    document.documentElement.classList.add('dark');
                                }
                            } catch (e) {}
                        `,
                    }}
                />
            </head>
            <body className="min-h-screen bg-[#09090B] text-white transition-colors duration-200">

                {children}

                <Toaster position="top-right" />

            </body>
        </html>
    );
}
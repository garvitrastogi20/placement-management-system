"use client";

export default function Background({ children }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#09090B] dark:text-white">
            {/* Top Left Glow */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -left-40
                    -top-40
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-blue-400/15
                    blur-[140px]
                    dark:bg-[#C97B3C]/20
                "
            />

            {/* Top Right Glow */}
            <div
                className="
                    pointer-events-none
                    absolute
                    right-0
                    top-20
                    h-[450px]
                    w-[450px]
                    rounded-full
                    bg-indigo-300/20
                    blur-[140px]
                    dark:bg-[#F4C27A]/15
                "
            />

            {/* Bottom Glow */}
            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-0
                    left-1/3
                    h-[400px]
                    w-[400px]
                    rounded-full
                    bg-blue-300/15
                    blur-[120px]
                    dark:bg-[#C97B3C]/10
                "
            />

            {/* Grid Pattern */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[size:45px_45px]
                    opacity-[0.03]
                    bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)]
                    dark:bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                "
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
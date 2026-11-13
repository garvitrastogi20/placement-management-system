"use client";

export default function Background({ children }) {

    return (

        <div className="relative min-h-screen overflow-hidden bg-[#09090B] text-white">

            {/* Top Left Glow */}

            <div
                className="
                    absolute
                    -top-40
                    -left-40
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-[#C97B3C]/20
                    blur-[140px]
                    pointer-events-none
                "
            />

            {/* Top Right Glow */}

            <div
                className="
                    absolute
                    top-20
                    right-0
                    h-[450px]
                    w-[450px]
                    rounded-full
                    bg-[#F4C27A]/15
                    blur-[140px]
                    pointer-events-none
                "
            />

            {/* Bottom Glow */}

            <div
                className="
                    absolute
                    bottom-0
                    left-1/3
                    h-[400px]
                    w-[400px]
                    rounded-full
                    bg-[#C97B3C]/10
                    blur-[120px]
                    pointer-events-none
                "
            />

            {/* Grid Pattern */}

            <div
                className="
                    absolute
                    inset-0
                    opacity-[0.03]
                    pointer-events-none
                    bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                    bg-[size:45px_45px]
                "
            />

            {/* Content */}

            <div className="relative z-10">

                {children}

            </div>

        </div>

    );

}
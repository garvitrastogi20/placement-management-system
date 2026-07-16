"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaGraduationCap, FaBuilding } from "react-icons/fa";

export default function Hero() {
    return (
        <section className="relative overflow-hidden">

            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-950 to-black" />

            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20" />

            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-700 rounded-full blur-3xl opacity-20" />

            <div className="relative max-w-7xl mx-auto px-8 py-32">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                >

                    <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">

                        AI Powered

                        <span className="text-blue-500">
                            {" "}Placement{" "}
                        </span>

                        Management Platform

                    </h1>

                    <p className="text-xl text-gray-300 mt-8 leading-8">

                        One platform for Students, Recruiters and
                        Colleges to simplify hiring, applications,
                        resume management and campus placements.

                    </p>

                    <div className="flex flex-wrap gap-5 mt-10">

                        <Link
                            href="/register"
                            className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl flex items-center gap-3 font-semibold text-lg"
                        >
                            Get Started
                            <FaArrowRight />
                        </Link>

                        <Link
                            href="/login"
                            className="border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition px-8 py-4 rounded-xl font-semibold text-lg"
                        >
                            Login
                        </Link>

                    </div>

                    <div className="flex gap-10 mt-16">

                        <div className="flex items-center gap-3">

                            <FaGraduationCap
                                className="text-blue-500 text-3xl"
                            />

                            <div>

                                <h3 className="font-bold">
                                    Students
                                </h3>

                                <p className="text-gray-400 text-sm">
                                    Apply with one click
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            <FaBuilding
                                className="text-green-500 text-3xl"
                            />

                            <div>

                                <h3 className="font-bold">
                                    Recruiters
                                </h3>

                                <p className="text-gray-400 text-sm">
                                    Hire top talent
                                </p>

                            </div>

                        </div>

                    </div>

                </motion.div>

            </div>

        </section>
    );
}
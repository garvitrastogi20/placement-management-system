"use client";

import { motion } from "framer-motion";
import {
    FaRobot,
    FaFileUpload,
    FaBriefcase,
    FaChartBar,
    FaBell,
    FaShieldAlt,
} from "react-icons/fa";

const features = [
    {
        icon: <FaRobot />,
        title: "AI Resume Analysis",
        description:
            "Analyze resumes instantly and receive smart suggestions to improve ATS compatibility.",
        color: "text-blue-400",
    },
    {
        icon: <FaBriefcase />,
        title: "Smart Job Matching",
        description:
            "Recommend jobs based on skills, CGPA, interests and recruiter requirements.",
        color: "text-green-400",
    },
    {
        icon: <FaFileUpload />,
        title: "Resume Management",
        description:
            "Upload, update and manage resumes securely with Cloudinary integration.",
        color: "text-yellow-400",
    },
    {
        icon: <FaChartBar />,
        title: "Placement Analytics",
        description:
            "Track applications, interviews, shortlisted candidates and placement progress.",
        color: "text-purple-400",
    },
    {
        icon: <FaBell />,
        title: "Instant Notifications",
        description:
            "Receive updates whenever your application status changes.",
        color: "text-pink-400",
    },
    {
        icon: <FaShieldAlt />,
        title: "Secure Authentication",
        description:
            "JWT based authentication with role-based access for Students and Recruiters.",
        color: "text-cyan-400",
    },
];

export default function Features() {
    return (
        <section className="py-24 bg-transparent">

            <div className="max-w-7xl mx-auto px-6 sm:px-8">

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >

                    <h2 className="text-3xl sm:text-5xl font-bold text-center mb-4 text-slate-900 dark:text-white">
                        Powerful Features
                    </h2>

                    <p className="text-center text-slate-600 dark:text-gray-400 text-base sm:text-lg mb-16 max-w-2xl mx-auto">
                        Everything you need to simplify and accelerate campus recruitment.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {features.map((feature, index) => (

                            <motion.div
                                key={index}
                                whileHover={{
                                    scale: 1.03,
                                    y: -6,
                                }}
                                transition={{
                                    duration: 0.25,
                                }}
                                className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur-xl transition hover:shadow-md dark:border-white/10 dark:bg-gray-900/90 dark:hover:border-white/20"
                            >

                                <div
                                    className={`text-4xl mb-5 ${feature.color}`}
                                >
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                                    {feature.description}
                                </p>

                            </motion.div>

                        ))}

                    </div>

                </motion.div>

            </div>

        </section>
    );
}
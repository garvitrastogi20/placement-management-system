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
        <section className="bg-black py-24">

            <div className="max-w-7xl mx-auto px-8">

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >

                    <h2 className="text-5xl font-bold text-center mb-5">
                        Powerful Features
                    </h2>

                    <p className="text-center text-gray-400 text-lg mb-16">
                        Everything you need to simplify campus placements.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {features.map((feature, index) => (

                            <motion.div
                                key={index}
                                whileHover={{
                                    scale: 1.05,
                                    y: -10,
                                }}
                                transition={{
                                    duration: 0.25,
                                }}
                                className="bg-gray-900 border border-gray-800 rounded-3xl p-8"
                            >

                                <div
                                    className={`text-5xl mb-6 ${feature.color}`}
                                >
                                    {feature.icon}
                                </div>

                                <h3 className="text-2xl font-bold mb-4">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-400 leading-7">
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
"use client";

import { motion } from "framer-motion";
import {
    FaUserGraduate,
    FaBuilding,
    FaBriefcase,
    FaChartLine,
} from "react-icons/fa";

const stats = [
    {
        icon: <FaUserGraduate />,
        number: "5,000+",
        title: "Students",
        color: "text-blue-400",
    },
    {
        icon: <FaBuilding />,
        number: "250+",
        title: "Companies",
        color: "text-green-400",
    },
    {
        icon: <FaBriefcase />,
        number: "15,000+",
        title: "Applications",
        color: "text-yellow-400",
    },
    {
        icon: <FaChartLine />,
        number: "95%",
        title: "Placement Rate",
        color: "text-purple-400",
    },
];

export default function Stats() {
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
                        Trusted by Thousands
                    </h2>

                    <p className="text-center text-slate-600 dark:text-gray-400 mb-14 text-base sm:text-lg">
                        Connecting ambitious students with leading national and global employers.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {stats.map((item, index) => (

                            <motion.div
                                key={index}
                                whileHover={{
                                    scale: 1.04,
                                    y: -6,
                                }}
                                transition={{
                                    duration: 0.25,
                                }}
                                className="rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/90 dark:shadow-xl"
                            >

                                <div
                                    className={`text-4xl mb-4 ${item.color}`}
                                >
                                    {item.icon}
                                </div>

                                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                    {item.number}
                                </h3>

                                <p className="text-slate-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
                                    {item.title}
                                </p>

                            </motion.div>

                        ))}

                    </div>

                </motion.div>

            </div>

        </section>
    );
}
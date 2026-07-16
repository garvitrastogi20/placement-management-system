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
        <section className="bg-gray-950 py-24">

            <div className="max-w-7xl mx-auto px-8">

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >

                    <h2 className="text-4xl font-bold text-center mb-4">
                        Trusted by Thousands
                    </h2>

                    <p className="text-center text-gray-400 mb-14 text-lg">
                        Connecting talented students with leading recruiters.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {stats.map((item, index) => (

                            <motion.div
                                key={index}
                                whileHover={{
                                    scale: 1.05,
                                    y: -8,
                                }}
                                transition={{
                                    duration: 0.25,
                                }}
                                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center shadow-xl"
                            >

                                <div
                                    className={`text-5xl mb-5 ${item.color}`}
                                >
                                    {item.icon}
                                </div>

                                <h3 className="text-4xl font-extrabold">
                                    {item.number}
                                </h3>

                                <p className="text-gray-400 mt-3 text-lg">
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
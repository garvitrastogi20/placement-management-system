"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const companies = [
    { name: "Microsoft", logo: "/logos/microsoft.svg" },
    { name: "Google", logo: "/logos/google.svg" },
    { name: "Amazon", logo: "/logos/amazon.svg" },
    { name: "Adobe", logo: "/logos/adobe.svg" },
    { name: "IBM", logo: "/logos/ibm.svg" },
    { name: "Oracle", logo: "/logos/oracle.svg" },
    { name: "Infosys", logo: "/logos/infosys.svg" },
    { name: "TCS", logo: "/logos/tcs.svg" },
    { name: "Accenture", logo: "/logos/accenture.svg" },
    { name: "Deloitte", logo: "/logos/deloitte.svg" },
];

export default function Companies() {
    return (
        <section className="bg-black py-24 overflow-hidden">

            <div className="max-w-7xl mx-auto px-8">

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >

                    <h2 className="text-5xl font-bold text-center mb-5">
                        Trusted by Leading Companies
                    </h2>

                    <p className="text-center text-gray-400 text-lg mb-16">
                        Connecting talented students with world-class recruiters.
                    </p>

                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

                    {companies.map((company) => (

                        <motion.div
                            key={company.name}
                            whileHover={{
                                scale: 1.08,
                                y: -6,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex items-center justify-center h-36 hover:border-blue-500 transition"
                        >

                            <Image
                                src={company.logo}
                                alt={company.name}
                                width={140}
                                height={60}
                                className="object-contain grayscale hover:grayscale-0 transition duration-300"
                            />

                        </motion.div>

                    ))}

                </div>

            </div>

        </section>
    );
}
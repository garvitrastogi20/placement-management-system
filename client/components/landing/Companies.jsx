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
        <section id="companies" className="bg-transparent py-20 sm:py-24 overflow-hidden">

            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 text-slate-900 dark:text-white">
                        Trusted by Leading Companies
                    </h2>

                    <p className="text-center text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-12 sm:mb-16 max-w-2xl mx-auto">
                        Connecting talented students with world-class recruiters.
                    </p>

                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">

                    {companies.map((company) => (

                        <motion.div
                            key={company.name}
                            whileHover={{
                                scale: 1.05,
                                y: -4,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            className="bg-white/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 sm:p-8 flex items-center justify-center h-28 sm:h-36 shadow-sm hover:border-[#C97B3C]/50 transition"
                        >

                            <Image
                                src={company.logo}
                                alt={company.name}
                                width={140}
                                height={60}
                                className="object-contain grayscale hover:grayscale-0 transition duration-300 dark:brightness-125"
                            />

                        </motion.div>

                    ))}

                </div>

            </div>

        </section>
    );
}
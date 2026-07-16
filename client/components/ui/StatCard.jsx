import { motion } from "framer-motion";

export default function StatCard({
    title,
    value,
    icon,
    color,
    subtitle,
}) {
    return (
        <motion.div
            whileHover={{
                y: -6,
                scale: 1.02,
            }}
            transition={{
                duration: 0.2,
            }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl"
        >
            {/* Background Glow */}
            <div
                className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-20 ${color}`}
            />

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-gray-400 text-sm">
                        {title}
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {value}
                    </h2>

                    <p className="text-gray-500 text-sm mt-2">
                        {subtitle}
                    </p>

                </div>

                <div
                    className={`text-5xl ${color}`}
                >
                    {icon}
                </div>

            </div>

        </motion.div>
    );
}
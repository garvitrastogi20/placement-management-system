export default function GlassCard({
    children,
    className = "",
}) {
    return (
        <div
            className={`
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-2xl
                shadow-2xl
                p-6
                transition-all
                duration-300
                hover:border-blue-400/30
                hover:shadow-blue-500/10
                ${className}
            `}
        >
            {children}
        </div>
    );
}
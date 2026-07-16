export default function GradientButton({
    children,
    onClick,
    href,
    className = "",
}) {

    const classes = `
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        via-indigo-600
        to-purple-600
        px-6
        py-3
        font-semibold
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-blue-500/40
        ${className}
    `;

    if (href) {
        return (
            <a
                href={href}
                className={classes}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            onClick={onClick}
            className={classes}
        >
            {children}
        </button>
    );
}
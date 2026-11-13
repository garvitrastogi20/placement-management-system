"use client";

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-[#C97B3C]">
          Dashboard Section
        </p>

        <h2 className="text-4xl font-bold text-white">{title}</h2>

        {subtitle && (
          <p className="mt-3 max-w-2xl text-lg leading-7 text-gray-400">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

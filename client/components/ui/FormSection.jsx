"use client";

export default function FormSection({
  title,

  subtitle,

  children,
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>

        {subtitle && <p className="mt-2 text-gray-400">{subtitle}</p>}
      </div>

      {children}
    </section>
  );
}

"use client";

export default function StatCard({
  title,
  value,
  icon,
  color = "from-blue-500 to-indigo-600",
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-2xl text-white`}
      >
        {icon}
      </div>

      <h3 className="text-sm font-medium text-gray-400">{title}</h3>

      <p className="mt-2 text-4xl font-bold text-white">{value}</p>
    </div>
  );
}
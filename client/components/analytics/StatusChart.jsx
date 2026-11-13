"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";

const COLORS = ["#C97B3C", "#F4C27A", "#22C55E", "#EF4444"];

export default function StatusChart({ stats }) {
  const data = [
    {
      name: "Applied",
      value:
        stats.totalApplications -
        stats.shortlisted -
        stats.selected -
        stats.rejected,
    },
    {
      name: "Shortlisted",
      value: stats.shortlisted,
    },
    {
      name: "Selected",
      value: stats.selected,
    },
    {
      name: "Rejected",
      value: stats.rejected,
    },
  ];

  return (
    <GlassCard>
      <SectionHeader
        title="Application Status"
        subtitle="Distribution of all applications."
      />

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={3}
              animationDuration={1200}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#171412",
                border: "1px solid rgba(201,123,60,.35)",
                borderRadius: "16px",
                color: "#fff",
                boxShadow: "0 10px 40px rgba(0,0,0,.35)",
              }}
            />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                color: "#9CA3AF",
                paddingTop: "20px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#C97B3C]/20 bg-[#C97B3C]/10 p-4">
          <p className="text-sm text-gray-400">Total Applications</p>

          <h3 className="mt-2 text-2xl font-bold text-[#F4C27A]">
            {stats.totalApplications}
          </h3>
        </div>

        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-sm text-gray-400">Selected</p>

          <h3 className="mt-2 text-2xl font-bold text-green-400">
            {stats.selected}
          </h3>
        </div>
      </div>
    </GlassCard>
  );
}

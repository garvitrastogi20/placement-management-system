"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";

export default function MonthlyChart({ data = [] }) {
  return (
    <GlassCard>
      <SectionHeader
        title="Monthly Applications"
        subtitle="Track how applications have grown throughout the year."
      />

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="applicationGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#C97B3C" stopOpacity={0.45} />

                <stop offset="100%" stopColor="#C97B3C" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#2D2A28"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "#9CA3AF",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#9CA3AF",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value) => value}
              labelFormatter={(label) => `${label}`}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                return (
                  <div className="rounded-2xl border border-[#C97B3C]/30 bg-[#171412] p-4 shadow-xl">
                    <p className="mb-2 font-semibold text-white">{label}</p>

                    <p className="text-[#F4C27A]">
                      Applications :{" "}
                      <span className="font-bold">{payload[0].value}</span>
                    </p>
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="applications"
              fill="url(#applicationGradient)"
              stroke="transparent"
              legendType="none"
              activeDot={false}
            />

            <Line
              type="monotone"
              dataKey="applications"
              stroke="#F4C27A"
              strokeWidth={4}
              animationDuration={1200}
              dot={{
                fill: "#C97B3C",
                stroke: "#F4C27A",
                strokeWidth: 2,
                r: 5,
              }}
              activeDot={{
                r: 8,
                fill: "#F4C27A",
                stroke: "#C97B3C",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

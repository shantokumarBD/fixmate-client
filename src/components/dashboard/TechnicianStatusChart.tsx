"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface TechnicianStatusChartProps {
  stages: {
    label: string;
    count: number;
    color: string;
  }[];
  totalBookings: number;
}

export function TechnicianStatusChart({
  stages,
  totalBookings,
}: TechnicianStatusChartProps) {
  const chartData = stages.map((s) => ({
    name: s.label,
    count: s.count,
    fill:
      s.label === "Requested"
        ? "#2563EB"
        : s.label === "Accepted"
        ? "#4F46E5"
        : s.label === "In Progress"
        ? "#F59E0B"
        : s.label === "Completed"
        ? "#10B981"
        : "#EF4444",
  }));

  if (totalBookings === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center font-mono text-xs text-[#5B403A] border-2 border-dashed border-[#151515] rounded-[6px] bg-[#FEF9EF] mt-3">
        NO WORK ORDERS ASSIGNED YET
      </div>
    );
  }

  return (
    <div className="w-full h-[190px] pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: "#151515", strokeWidth: 2 }}
            tick={{ fill: "#151515", fontSize: 10, fontWeight: "bold" }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={{ stroke: "#151515", strokeWidth: 2 }}
            tick={{ fill: "#151515", fontSize: 10, fontWeight: "bold" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] p-2 rounded-[6px] font-sans">
                    <p className="font-heading font-bold text-xs uppercase tracking-wider text-[#151515]">
                      {data.name}
                    </p>
                    <p className="font-mono text-xs font-bold text-[#FF5B2E] mt-0.5">
                      {data.count} {data.count === 1 ? "Job" : "Jobs"}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} stroke="#151515" strokeWidth={2}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
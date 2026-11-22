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

interface CustomerStatusChartProps {
  statusCounts: {
    requested: number;
    accepted: number;
    "in-progress": number;
    completed: number;
    rejected: number;
    cancelled: number;
  };
  totalRequests: number;
}

export function CustomerStatusChart({
  statusCounts,
  totalRequests,
}: CustomerStatusChartProps) {
  const chartData = [
    { name: "Requested", count: statusCounts.requested, fill: "#2563EB" },
    { name: "Accepted", count: statusCounts.accepted, fill: "#4F46E5" },
    { name: "In Progress", count: statusCounts["in-progress"], fill: "#F59E0B" },
    { name: "Completed", count: statusCounts.completed, fill: "#10B981" },
    {
      name: "Cancelled",
      count: statusCounts.cancelled + statusCounts.rejected,
      fill: "#EF4444",
    },
  ];

  return (
    <div className="w-full h-[220px] pt-3">
      {totalRequests === 0 ? (
        <div className="h-full flex items-center justify-center font-mono text-xs text-[#5B403A] border-2 border-dashed border-[#151515] rounded-[6px] bg-[#FEF9EF]">
          NO ACTIVE WORK ORDERS TO DISPLAY
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{ stroke: "#151515", strokeWidth: 2 }}
              tick={{ fill: "#151515", fontSize: 11, fontWeight: "bold" }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: "#151515", strokeWidth: 2 }}
              tick={{ fill: "#151515", fontSize: 11, fontWeight: "bold" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] p-2.5 rounded-[6px] font-sans">
                      <p className="font-heading font-bold text-xs uppercase tracking-wider text-[#151515]">
                        {data.name}
                      </p>
                      <p className="font-mono text-xs font-bold text-[#FF5B2E] mt-0.5">
                        {data.count} {data.count === 1 ? "Order" : "Orders"}
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
      )}
    </div>
  );
}
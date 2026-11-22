"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface AdminChartsProps {
  techCount: number;
  customerCount: number;
  recentBookings: {
    _id: string;
    finalAmount?: number;
    basePrice?: number;
    createdAt?: string | Date;
    serviceTitle: string;
  }[];
}

export function AdminOverviewCharts({
  techCount,
  customerCount,
  recentBookings,
}: AdminChartsProps) {
  // 1. Data for Users by Role (Pie/Donut)
  const userRoleData = [
    { name: "Customers", value: customerCount, fill: "#2563EB" },
    { name: "Technicians", value: techCount, fill: "#FCD03D" },
  ];

  // 2. Data for Revenue / Orders over recent jobs
  const revenueData = recentBookings
    .slice()
    .reverse()
    .map((b) => ({
      name: `#${b._id.slice(-4).toUpperCase()}`,
      amount: Number(b.finalAmount || b.basePrice || 0),
      title: b.serviceTitle,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Chart 1: Ticket Revenue Velocity (7 Columns — প্রশস্ত এবং পরিষ্কার রিডিং) */}
      <div className="lg:col-span-7 bg-white border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#151515]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#10B981] border border-[#151515]"></span>
            <h3 className="font-heading font-extrabold text-sm uppercase text-[#151515] tracking-tight">
              Ticket Revenue Velocity
            </h3>
          </div>
          <span className="font-mono text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] border border-[#151515] px-2 py-0.5 rounded">
            SETTLED USD ORDERS
          </span>
        </div>

        {revenueData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center font-mono text-xs text-[#5B403A] border-2 border-dashed border-[#151515] rounded bg-[#FEF9EF] my-2">
            NO RECENT SETTLED ORDERS
          </div>
        ) : (
          <div className="h-[210px] w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: "#151515", strokeWidth: 1.5 }}
                  tick={{ fill: "#151515", fontSize: 11, fontWeight: "bold" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "#151515", strokeWidth: 1.5 }}
                  tick={{ fill: "#151515", fontSize: 11, fontWeight: "bold" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border-2 border-[#151515] shadow-[3px_3px_0px_#151515] p-2.5 rounded-[6px] text-xs font-sans">
                          <p className="font-bold text-[#151515]">{data.title}</p>
                          <p className="font-mono font-bold text-[#16A34A] mt-1 text-sm">
                            {formatCurrency(data.amount)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="#10B981"
                  stroke="#151515"
                  strokeWidth={2}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="font-sans text-[11px] text-[#5B403A] pt-2 border-t border-[#151515]/20 mt-2">
          Real-time transactional gross revenue per hardware service ticket.
        </p>
      </div>

      {/* Chart 2: User Base Composition (5 Columns — পারফেক্ট ডোন্ট চার্ট) */}
      <div className="lg:col-span-5 bg-[#FEF9EF] border-2 border-[#151515] rounded-[10px] p-5 shadow-[4px_4px_0px_#151515] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#151515]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#2563EB] border border-[#151515]"></span>
            <h3 className="font-heading font-extrabold text-sm uppercase text-[#151515] tracking-tight">
              User Base Composition
            </h3>
          </div>
          <span className="font-mono text-[11px] font-bold bg-white border border-[#151515] px-2 py-0.5 rounded">
            TOTAL: {techCount + customerCount}
          </span>
        </div>

        <div className="h-[190px] w-full flex items-center justify-center my-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={userRoleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                stroke="#151515"
                strokeWidth={2}
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    return (
                      <div className="bg-white border-2 border-[#151515] shadow-[2px_2px_0px_#151515] px-2.5 py-1.5 rounded text-xs font-mono font-bold">
                        <span>{data.name}: </span>
                        <span className="text-[#FF5B2E]">{data.value} users</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-around font-mono text-xs font-bold pt-3 border-t-2 border-[#151515] bg-white p-2 rounded-[6px] border border-[#151515]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#2563EB] border border-[#151515] rounded-sm"></span>
            <span>Customers ({customerCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#FCD03D] border border-[#151515] rounded-sm"></span>
            <span>Techs ({techCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
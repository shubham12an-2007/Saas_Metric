import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SpendChart({ data }) {
  // Fallback static dummy data agar backend se real data na aaye testing ke liye
  const defaultData = [
    { month: "Jan", spend: 120 },
    { month: "Feb", spend: 150 },
    { month: "Mar", spend: 180 },
    { month: "Apr", spend: 240 },
    { month: "May", spend: 210 },
    { month: "Jun", spend: 290 },
  ];

  const chartData = data || defaultData;

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: "8px",
              border: "none",
            }}
            labelStyle={{ color: "#94a3b8" }}
            itemStyle={{ color: "#fff" }}
            formatter={(value) => [`$${value}`, "Spend"]}
          />
          <Area
            type="monotone"
            dataKey="spend"
            stroke="#2563eb"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSpend)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import React from "react";
import SpendChart from "../components/Charts/SpendChart";

export default function Dashboard() {
  const stats = [
    { title: "Monthly Spend", value: "$240.50", change: "+12%", trend: "up" },
    {
      title: "Active Subscriptions",
      value: "14",
      change: "0",
      trend: "neutral",
    },
    {
      title: "Next Renewal",
      value: "July 04",
      change: "Netflix",
      trend: "info",
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Overview Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Track and optimize your operational recurring costs.
          </p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all">
          + Add Subscription
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
          >
            <span className="text-sm font-medium text-slate-400">
              {stat.title}
            </span>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "bg-amber-50 text-amber-700"
                    : stat.trend === "info"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Render actual chart component inside the block */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Spending Over Time
            </h3>
          </div>
          <SpendChart />
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-400 text-sm">
          Upcoming Renewals List Placeholder
        </div>
      </div>
    </div>
  );
}

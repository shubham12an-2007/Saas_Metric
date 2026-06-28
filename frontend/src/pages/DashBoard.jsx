import React from "react";
import SpendChart from "../components/Charts/SpendChart";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Overview Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Track and optimize your operational recurring costs.
          </p>
        </div>
        <Button variant="primary">+ Add Subscription</Button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
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
          </Card>
        ))}
      </div>

      {/* Analytics Chart Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Spending Over Time" className="lg:col-span-2">
          <SpendChart />
        </Card>

        <Card title="Upcoming Renewals">
          <div className="text-sm text-slate-400 flex items-center justify-center h-full min-h-[250px]">
            No upcoming renewals this week
          </div>
        </Card>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { subscriptionService } from "../services/api";
// 🔥 Live Chart Elements
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import SpendChart from "../components/Charts/SpendChart";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";

export default function Dashboard() {
  // --- Live State Matrix ---
  const [statsData, setStatsData] = useState({
    totalMonthlySpend: 0,
    activeCount: 0,
    totalSubscriptions: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [upcomingSubs, setUpcomingSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Entertainment",
    price: "",
    nextBilling: "",
    status: "Active",
  });

  // Chart Sections Color Palette
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const [logs, setLogs] = useState([]); // 🔥 Activity logs ke liye state

  // 1. Fetch Backend Stats & Chart Data Pipelines
  const fetchDashboardStats = async () => {
    try {
      // Metric Numbers Call
      const statsResponse = await subscriptionService.getAnalytics();
      setStatsData(statsResponse.data.stats || statsResponse.data);

      // 🔥 Category Chart Data Call (Safe-try catch inside to prevent crash)
      try {
        const chartResponse = await subscriptionService.getCategoryAnalytics();
        const formattedData = chartResponse.data.analytics.map((item) => ({
          name: item.category,
          value: item.totalSpend,
        }));
        setChartData(formattedData);
      } catch (chartErr) {
        console.error("Failed fetching category chart data:", chartErr);
      }

      try {
        const upcomingResponse =
          await subscriptionService.getUpcomingRenewals();
        setUpcomingSubs(
          upcomingResponse.data.upcoming || upcomingResponse.data,
        );
      } catch (upcomingErr) {
        console.error("Failed fetching upcoming renewals:", upcomingErr);
      }

      try {
        const logsResponse = await subscriptionService.getActivityLogs();
        setLogs(logsResponse.data.logs || logsResponse.data);
      } catch (logsErr) {
        console.error("Failed fetching activity logs:", logsErr);
      }
    } catch (err) {
      console.error("Failed fetching database stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // 2. Submit Form to Backend
  const handleAddSubscription = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        nextBilling: new Date(formData.nextBilling).toISOString(),
      };

      console.log("Hitting secured service endpoint...");
      await subscriptionService.create(payload);

      alert("Asset deployed into MongoDB successfully!");
      setIsModalOpen(false);
      setFormData({
        name: "",
        category: "Entertainment",
        price: "",
        nextBilling: "",
      });
      fetchDashboardStats();
    } catch (err) {
      console.error("Pipeline failure:", err);
      alert(
        `Backend Refusal: ${err.response?.data?.message || "Status Code " + err.response?.status}`,
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-500 font-mono">
        Synchronizing Metrics Console...
      </div>
    );
  }

  const dynamicStats = [
    {
      title: "Monthly Spend",
      value: `$${statsData.totalMonthlySpend}`,
      change: "Live Burn",
      trend: "up",
    },
    {
      title: "Active Subscriptions",
      value: `${statsData.activeCount}`,
      change: "Active Nodes",
      trend: "neutral",
    },
    {
      title: "Total Tracked Subscriptions",
      value: `${statsData.totalSubscriptions}`,
      change: "Total Node Count",
      trend: "info",
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen w-full relative">
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
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Add Subscription
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dynamicStats.map((stat) => (
          <Card key={stat.title}>
            <span className="text-sm font-medium text-slate-400">
              {stat.title}
            </span>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-amber-50 text-amber-700" : stat.trend === "info" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}
              >
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Chart Block */}
      {/* Analytics Chart & Upcoming Renewals Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Spending Over Time (Left Side - Bada Card) */}
        <Card title="Spending Over Time" className="lg:col-span-2">
          <SpendChart />
        </Card>

        {/* 2. Spend Distribution Pie Chart (Right Side - Chota Card) */}
        <Card title="Spend Distribution">
          {chartData.length === 0 ? (
            <div className="text-sm text-slate-400 flex items-center justify-center h-full min-h-[250px]">
              No active metrics found. Add subscriptions to view matrix.
            </div>
          ) : (
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      color: "#0f172a",
                    }}
                    formatter={(value) => [`$${value}`, "Total Cost"]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* 🔥 3. NEW DYNAMIC UPCOMING RENEWALS CARD (Yeh niche full-width ya flexible grid me set ho jayega) */}
        <Card title="Upcoming Renewals" className="lg:col-span-3">
          {upcomingSubs.length === 0 ? (
            <div className="text-sm text-slate-400 flex items-center justify-center p-6 text-center">
              No upcoming renewals this week. All systems clear! 🎉
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {upcomingSubs.map((sub) => {
                const daysLeft = Math.ceil(
                  (new Date(sub.nextBilling) - new Date()) /
                    (1000 * 60 * 60 * 24),
                );

                return (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">
                        {sub.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {new Date(sub.nextBilling).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-slate-900 block">
                        ${sub.price}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          daysLeft <= 2
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {daysLeft <= 0 ? "Today" : `In ${daysLeft} days`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Activity History & Audit Logs">
          {logs.length === 0 ? (
            <div className="text-sm text-slate-400 p-6 text-center">
              No recent activities recorded yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      log.action === "CREATED"
                        ? "bg-green-500"
                        : log.action === "UPDATED"
                          ? "bg-blue-500"
                          : "bg-red-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 font-medium">
                      {log.message}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 📥 FLOATING MODAL FORM FOR ADDING ASSET */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl w-full max-w-md text-slate-900">
            <h2 className="text-xl font-bold mb-4">Log New Asset Entry</h2>
            <form onSubmit={handleAddSubscription} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS, Netflix"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-900"
                >
                  <option>Entertainment</option>
                  <option>Infrastructure</option>
                  <option>Productivity</option>
                  <option>Finance</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  Monthly Cost ($)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  Next Billing Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.nextBilling}
                  onChange={(e) =>
                    setFormData({ ...formData, nextBilling: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  Initial Status
                </label>
                <select
                  value={formData.status || "Active"} // By default 'Active' rahega
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-900"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive / Paused</option>
                </select>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold py-3 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/20"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

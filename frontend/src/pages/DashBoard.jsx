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
  // Add this at the top of your component with your other useState hooks

  // Then inside your useEffect where you fetch data:
  // setTotalMonthlySpend(response.data.totalSpend);
  // --- Live State Matrix ---
  const [statsData, setStatsData] = useState({
    totalMonthlySpend: 0,
    activeCount: 0,
    totalSubscriptions: 0,
  });

  // Naya state jo humne abhi banaya hai list ko chalane ke liye
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: "Netflix Premium",
      price: 649,
      category: "Entertainment",
      date: "2026-07-08",
    },
    {
      id: 2,
      name: "AWS Cloud Hosting",
      price: 2499,
      category: "Software",
      date: "2026-07-25",
    },
    {
      id: 3,
      name: "Spotify Premium",
      price: 119,
      category: "Music",
      date: "2026-07-05",
    },
  ]);

  // Temporary delete function taaki testing ke waqt error na aaye
  const handleDelete = (id, price) => {
    setSubscriptions(
      subscriptions.filter((sub) => sub.id !== id && sub._id !== id),
    );
  };

  const totalMonthlySpend = statsData?.totalMonthlySpend || 0;

  const [chartData, setChartData] = useState([]);
  const [upcomingSubs, setUpcomingSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [budgetLimit, setBudgetLimit] = useState(100); // Default budget
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetInput, setNewBudgetInput] = useState("");
  const [renewalDate, setRenewalDate] = useState("");

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

  const fetchBudgetData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/subscription/budget",
      );
      // Assuming your API returns an object with this value
      setTotalMonthlySpend(response.data.totalMonthlySpend || 0);
    } catch (error) {
      console.error("Budget fetch failed:", error);
    }
  };

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

      try {
        const budgetRes = await subscriptionService.getBudget();
        const currentLimit = budgetRes.data.budget?.monthlyLimit || 100;
        setBudgetLimit(currentLimit);
        setNewBudgetInput(currentLimit);
      } catch (err) {
        console.error("Budget fetch failed:", err);
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

      {/* --- STEP 3: ACTIVE TRACKERS & DEADLINES COUNTER --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">
            Active Trackers & Renewals
          </h3>
          <p className="text-xs text-slate-500">
            Live tracker for your upcoming subscription billing cycles.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Subscription Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Monthly Cost</th>
                <th className="p-4">Status / Days Left</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {subscriptions &&
                subscriptions.map((sub) => {
                  // Live Days Calculation Logic
                  const today = new Date();
                  const expiry = sub.date ? new Date(sub.date) : null;
                  let statusBadge = (
                    <span className="text-slate-400 italic">No Date Set</span>
                  );

                  if (expiry) {
                    const diffTime = expiry - today;
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24),
                    );

                    if (diffDays < 0) {
                      statusBadge = (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          Expired ❌
                        </span>
                      );
                    } else if (diffDays === 0) {
                      statusBadge = (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 animate-pulse">
                          ⚠️ Renews TODAY!
                        </span>
                      );
                    } else if (diffDays <= 3) {
                      statusBadge = (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          🚨 Only {diffDays} days left!
                        </span>
                      );
                    } else {
                      statusBadge = (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          In {diffDays} days
                        </span>
                      );
                    }
                  }

                  return (
                    <tr
                      key={sub.id || sub._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-900">
                        {sub.name}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {sub.category || "General"}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-900">
                        ₹{sub.price}
                      </td>
                      <td className="p-4">{statusBadge}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() =>
                            handleDelete(sub.id || sub._id, sub.price)
                          }
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {/* If no subscriptions exist */}
              {(!subscriptions || subscriptions.length === 0) && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-400 italic"
                  >
                    No active subscriptions found. Click "+ Add Subscription" to
                    start tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      {/* 🔥 SMART BUDGET TRACKER & ALERT PANEL */}
      <div className="mb-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>🎯 Monthly Budget Tracker</span>
              {/* Dynamic Warning Badges */}
              {totalMonthlySpend / budgetLimit >= 1 ? (
                <span className="bg-red-50 text-red-600 text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                  🚨 Budget Blown!
                </span>
              ) : totalMonthlySpend / budgetLimit >= 0.8 ? (
                <span className="bg-amber-50 text-amber-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  ⚠️ Warning: Approaching Limit
                </span>
              ) : (
                <span className="bg-green-50 text-green-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  ✅ Within Budget
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              You have spent ${totalMonthlySpend} out of your ${budgetLimit}{" "}
              monthly limit.
            </p>
          </div>

          {/* Budget Edit Input Form */}
          <div className="flex items-center gap-2">
            {isEditingBudget ? (
              <>
                <input
                  type="number"
                  value={newBudgetInput}
                  onChange={(e) => setNewBudgetInput(e.target.value)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded-xl p-2 text-sm text-center font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleBudgetUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-xl cursor-pointer font-medium transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingBudget(false)}
                  className="text-slate-400 text-xs px-2 hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditingBudget(true)}
                className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs px-3 py-2 rounded-xl cursor-pointer font-medium transition"
              >
                Set Limit ⚙️
              </button>
            )}
          </div>
        </div>

        {/* 📊 LIVE PROGRESS BAR */}
        <div className="mt-4">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              style={{
                width: `${Math.min((totalMonthlySpend / budgetLimit) * 100, 100)}%`,
              }}
              className={`h-full transition-all duration-500 rounded-full ${
                totalMonthlySpend / budgetLimit >= 1
                  ? "bg-red-500"
                  : totalMonthlySpend / budgetLimit >= 0.8
                    ? "bg-amber-500"
                    : "bg-blue-500"
              }`}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
            <span>0%</span>
            <span>80% Warning</span>
            <span>100% Max (${budgetLimit})</span>
          </div>
        </div>
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

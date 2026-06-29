import React, { useEffect, useState } from "react";
// Purana 'import axios from "axios"' hata do, aur apna service import karo
import { subscriptionService } from "../services/api";
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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control state

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Entertainment",
    price: "",
    nextBilling: "",
  });

  // 1. Fetch Backend Stats Pipeline
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/subscriptions/stats",
        {
          withCredentials: true,
        },
      );
      setStatsData(response.data.stats);
    } catch (err) {
      console.error(
        "Failed fetching database stats:",
        err.response?.data || err.message,
      );
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

      // 🔥 Yeh tumhare api.js ke secure instance se request bhejega
      const response = await subscriptionService.create(payload);

      alert("Asset deployed into MongoDB successfully!");
      setIsModalOpen(false);
      setFormData({
        name: "",
        category: "Entertainment",
        price: "",
        nextBilling: "",
      });
      fetchDashboardStats(); // Dashboard ke data ko live refresh karega
    } catch (err) {
      console.error("Pipeline failure:", err);
      // Agar abhi bhi error aaye, toh exact server ka error message screen par dikhega
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

  // Map backend stats to your original UI Layout structure
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
        {/* 🔥 FIX: Connected button to open Form Modal */}
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

      {/* 📥 DYNAMIC FLOATING MODAL FORM FOR ADDING ASSET */}
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

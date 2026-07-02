import React, { useState, useEffect } from "react";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { subscriptionService } from "./services/api";

// ==========================================
// 📑 DYNAMIC SUBSCRIPTIONS PANEL WITH EDIT & DELETE
// ==========================================
function MySubscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Edit System States ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubId, setEditingSubId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "Entertainment",
    price: "",
    nextBilling: "",
  });

  // 1. Load Data Pipeline
  const loadSubs = async () => {
    try {
      const response = await subscriptionService.getAll();
      setSubs(response.data.subscriptions || response.data);
    } catch (err) {
      console.error("Error loading subscriptions cluster:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (sub) => {
    try {
      const newStatus = sub.status === "Active" ? "Inactive" : "Active";

      // Hum backend ke vahi update controller ko hit karenge jo tumne pehle banaya thaa!
      await subscriptionService.update(sub._id, { status: newStatus });

      alert(`Status updated to ${newStatus}!`);
      loadSubs(); // Table reload data live
    } catch (err) {
      console.error("Status toggle failed:", err);
      alert(`Backend Refusal: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    loadSubs();
  }, []);

  // 2. Live Delete Trigger
  const handleDelete = async (id) => {
    if (window.confirm("Bhai, pakka is subscription ko delete karna hai?")) {
      try {
        await subscriptionService.delete(id);
        alert("Subscription unlinked successfully!");
        loadSubs();
      } catch (err) {
        console.error("Delete failed:", err);
        alert(err.response?.data?.message || "Error dropping asset node.");
      }
    }
  };

  // 🔥 3. OPEN EDIT MODAL & PRE-POPULATE DATA
  const openEditModal = (sub) => {
    setEditingSubId(sub._id);

    // HTML Date Input require format YYYY-MM-DD, so parsing string date here
    const formattedDate = sub.nextBilling
      ? new Date(sub.nextBilling).toISOString().split("T")[0]
      : "";

    setEditFormData({
      name: sub.name,
      category: sub.category,
      price: sub.price,
      nextBilling: formattedDate,
    });
    setIsEditModalOpen(true);
  };

  // 🔥 4. SUBMIT EDIT TO BACKEND
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editFormData.name.trim(),
        category: editFormData.category,
        price: parseFloat(editFormData.price),
        nextBilling: new Date(editFormData.nextBilling).toISOString(),
      };

      await subscriptionService.update(editingSubId, payload);

      alert("Asset configuration updated successfully!");
      setIsEditModalOpen(false);
      loadSubs(); // Live reload data grid
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Error updating cluster schema.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-400 font-mono text-sm animate-pulse">
        ⚡ Querying Active Pipeline Clusters...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen text-slate-900 relative">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Active Core Subscriptions
        </h2>
        <p className="text-sm text-slate-500">
          Live grid mapping your registered active nodes.
        </p>
      </div>

      {subs.length === 0 ? (
        <div className="p-12 text-slate-400 bg-white rounded-2xl border border-slate-200 text-center text-sm shadow-sm">
          No deployed assets detected in your current MongoDB cluster.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase font-mono border-b border-slate-200/80">
              <tr>
                <th className="p-4 font-semibold">Asset Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Monthly Cost</th>
                <th className="p-4 font-semibold">Next Renewal</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {subs.map((sub) => (
                <tr
                  key={sub._id}
                  className="hover:bg-slate-50/50 transition duration-150"
                >
                  <td className="p-4 font-semibold text-slate-900">
                    {sub.name}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {sub.category}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleStatusToggle(sub)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border cursor-pointer transition ${
                        sub.status === "Inactive"
                          ? "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      }`}
                    >
                      {sub.status || "Active"} 🔄
                    </button>
                  </td>

                  <td className="p-4 font-mono font-medium text-slate-900">
                    ${sub.price}
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(sub.nextBilling).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  {/* Action Controllers */}
                  <td className="p-4 flex items-center justify-center space-x-2">
                    {/* ✏️ EDIT BUTTON */}
                    <button
                      onClick={() => openEditModal(sub)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold transition border border-blue-200"
                    >
                      ✏️ Edit
                    </button>
                    {/* 🗑️ DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition border border-red-200"
                    >
                      🗑️ Drop
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📝 POPUP MODAL FORM FOR EDITING SUBSCRIPTION */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl w-full max-w-md text-slate-900">
            <h2 className="text-xl font-bold mb-4">Modify Asset Log</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  Category
                </label>
                <select
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      category: e.target.value,
                    })
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
                  value={editFormData.price}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, price: e.target.value })
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
                  value={editFormData.nextBilling}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      nextBilling: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-900"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold py-3 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/20"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ⚙️ SETTINGS PANEL COMPONENT (PLACEHOLDER)
// ==========================================
const Settings = () => (
  <div className="p-8 space-y-4 bg-slate-50 min-h-screen text-slate-900">
    <h2 className="text-2xl font-bold tracking-tight">
      Control Panel Settings
    </h2>
    <p className="text-sm text-slate-500">
      System architecture variables and configuration logs.
    </p>
    <div className="p-6 bg-white border border-slate-200 rounded-2xl text-sm text-slate-400 font-mono shadow-sm">
      ⚙️ Core settings configuration node live. Ready for security module
      binding.
    </div>
  </div>
);

// ==========================================
// 🛡️ AUTHENTICATED OR UN-AUTH ROUTING APP CONTENT
// ==========================================
function AppContent() {
  const { user, loading } = useAuthContext();
  const [screen, setScreen] = useState("login");
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm font-mono tracking-wide">
        <span className="animate-pulse">
          ⚡ SYNCHRONIZING SYSTEM ROUTING PLATFORM...
        </span>
      </div>
    );
  }

  if (!user) {
    if (screen === "register") {
      return <Register navigateToLogin={() => setScreen("login")} />;
    }
    return <Login navigateToRegister={() => setScreen("register")} />;
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "subscriptions":
        return <MySubscriptions />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-slate-950 select-none">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-screen overflow-y-auto bg-slate-900">
        {renderMainContent()}
      </main>
    </div>
  );
}

// ==========================================
// 🚀 ROOT APP EXPORT WITH CONTEXT PROVIDER
// ==========================================
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

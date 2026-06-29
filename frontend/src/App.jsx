import React, { useState, useEffect } from "react";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { subscriptionService } from "./services/api";

// Mock ya real component placeholders agar abhi tak nahi banaye hain toh
function MySubscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubs = async () => {
      try {
        const response = await subscriptionService.getAll();
        // Support both response formats (array direct ya data.subscriptions wrapped)
        setSubs(response.data.subscriptions || response.data);
      } catch (err) {
        console.error("Error loading subscriptions cluster:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSubs();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-slate-400 font-mono text-sm animate-pulse">
        ⚡ Querying Active Pipeline Clusters...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen text-slate-900">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Settings
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

// app Content
function AppContent() {
  const { user, loading } = useAuthContext();
  const [screen, setScreen] = useState("login");

  // 🔥 FIX: Sidebar se dynamic click capture karne ke liye activeTab state lagayi
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm font-medium">
        ⚡ Synchronizing Security Session...
      </div>
    );
  }

  if (!user) {
    if (screen === "register") {
      return <Register navigateToLogin={() => setScreen("login")} />;
    }
    return <Login navigateToRegister={() => setScreen("register")} />;
  }

  // 🔥 FIX: activeTab ke mutabik main section ka content switch hoga
  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "subscriptions":
        return <MySubscriptions />; // Ya jo bhi tumhari subscriptions list component ka naam hai
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans bg-slate-950 text-slate-100">
      {/* 🔥 Sidebar ko state aur setter function pass kar diya */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 h-screen overflow-y-auto bg-slate-900/40">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

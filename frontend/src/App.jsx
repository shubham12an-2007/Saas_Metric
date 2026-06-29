import React, { useState } from "react";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Mock ya real component placeholders agar abhi tak nahi banaye hain toh
const MySubscriptions = () => (
  <div className="p-12 text-white">
    📑 My Subscriptions Content Pipeline Live
  </div>
);
const Settings = () => (
  <div className="p-12 text-white">⚙️ Control Panel Settings Node Live</div>
);

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

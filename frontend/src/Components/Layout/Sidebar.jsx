// Sidebar function arguments me activeTab aur setActiveTab receive karo
export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Logo Section */}
        <div className="text-xl font-bold text-cyan-400 font-mono tracking-wider">
          ⚡ SaaSMetric
        </div>

        {/* Navigation Buttons Container */}
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left p-3 rounded-xl transition text-sm ${activeTab === "dashboard" ? "bg-blue-600 text-white font-semibold" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`w-full text-left p-3 rounded-xl transition text-sm ${activeTab === "subscriptions" ? "bg-blue-600 text-white font-semibold" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            📑 My Subscriptions
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left p-3 rounded-xl transition text-sm ${activeTab === "settings" ? "bg-blue-600 text-white font-semibold" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            ⚙️ Settings
          </button>
        </nav>
      </div>
    </div>
  );
}

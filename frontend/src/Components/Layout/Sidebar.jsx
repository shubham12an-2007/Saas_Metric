import React from "react";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: "📊", active: true },
    { name: "My Subscriptions", icon: "💳", active: false },
    { name: "Analytics & Spends", icon: "📈", active: false },
    { name: "Settings", icon: "⚙️", active: false },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 border-r border-slate-800">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <span className="text-2xl">⚡</span>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            SaaSMetric
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                item.active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-slate-800 pt-4 flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
          SK
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">Shubham Kumar</p>
          <p className="text-xs text-slate-500">Pro Plan</p>
        </div>
      </div>
    </div>
  );
}

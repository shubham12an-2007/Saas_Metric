import React from "react";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function AppContent() {
  const { user } = useAuthContext();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto bg-slate-50">
        <Dashboard />
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

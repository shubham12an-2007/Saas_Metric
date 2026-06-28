import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthContext();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await login({ email, password });
      // Redirect logical handle yahan ho jayega auth state change par
    } catch (err) {
      setError("Invalid credentials or authentication endpoint error.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <span className="text-3xl">⚡</span>
          <h2 className="text-2xl font-bold tracking-tight mt-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome to SaaSMetric
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Provide your console credentials to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Email Endpoint
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-200 transition-colors"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Security Token
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-200 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm shadow-lg shadow-blue-600/10 transition-all mt-2"
          >
            Authenticate Access
          </button>
        </form>
      </div>
    </div>
  );
}

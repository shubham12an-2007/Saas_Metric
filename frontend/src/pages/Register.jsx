import React, { useState } from "react";
import axios from "axios";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

// 🔥 FIX: Destructured 'navigateToLogin' from props here
export default function Register({ navigateToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      // Direct Backend Endpoint call
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Account deployment successful! Redirecting to login...");

      // 🔥 FIX: 2 second baad direct bina router ke login page par toggle kar dega
      setTimeout(() => {
        navigateToLogin();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration pipeline compromised.",
      );
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <span className="text-3xl">🚀</span>
          <h2 className="text-2xl font-bold tracking-tight mt-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Create SaaSMetric Account
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deploy a new node to manage your sub metrics
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Operator Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email Endpoint"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />

          <Input
            label="Security Token (Password)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="primary" className="w-full mt-2">
            Initialize Access
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={navigateToLogin} // 🔥 Bina router ke login screen toggle ho jayegi
            className="text-blue-400 hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            Authenticate here
          </button>
        </p>
      </div>
    </div>
  );
}

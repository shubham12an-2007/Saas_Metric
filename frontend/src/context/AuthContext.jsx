import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/api";

// 1. Context Matrix Create Karo
const AuthContext = createContext(null);

// 2. Provider Component jo poore App ko wrap karega
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application load hote hi session validate karo (Auto-Login check)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.getProfile();
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false); // Global loading status stop
      }
    };
    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler Sub-routine
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout intercept error:", err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration pipeline failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, register, setUser }}
    >
      {/* Jab tak initial token verification chal rahi hai, blank screen ya fallback loader de sakte ho */}
      {!loading ? (
        children
      ) : (
        <div className="w-screen h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm font-medium">
          ⚡ Synchronizing Security Session...
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used strictly within an AuthProvider execution tree",
    );
  }
  return context;
};

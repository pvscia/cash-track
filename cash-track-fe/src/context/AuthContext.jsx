import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi } from "../api/AuthApi";
import { navigateTo } from "../utils/navigator";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // 👉 Single function handles everything
  const login = async (credentials) => {
    const data = await loginApi(credentials);
    if (!data.token) {
      throw new Error(data.message || "Invalid credentials");
    }
    setToken(data.token);
    setUser(data.user);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();

    navigateTo("/login");

  };

  const isAuthenticated = !!token;

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

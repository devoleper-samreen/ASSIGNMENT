import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export type UserRole = "admin" | "user" | "owner";

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    name: string;
    email: string;
    address: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Restore user from token on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchCurrentUser();
    }
  }, []);

  // Fetch current user details from backend
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await fetchCurrentUser();

      // Role-based redirect
      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "owner") navigate("/store-owner-dashboard");
      else navigate("/dashboard");

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    address: string;
    password: string;
  }): Promise<boolean> => {
    try {
      await api.post("/auth/register", data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

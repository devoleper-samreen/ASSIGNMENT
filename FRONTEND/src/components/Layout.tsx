import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  requireAuth = false,
  allowedRoles = [],
}) => {
  const { user } = useAuth();

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardRoutes = {
      admin: "/admin-dashboard",
      user: "/dashboard",
      owner: "/store-owner-dashboard",
    };
    return <Navigate to={dashboardRoutes[user.role] || "/login"} replace />;
  }

  return <>{children}</>;
};

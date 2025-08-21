import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <Layout requireAuth={true} allowedRoles={["user"]}>
                  <UserDashboard />
                </Layout>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <Layout requireAuth={true} allowedRoles={["admin"]}>
                  <AdminDashboard />
                </Layout>
              }
            />
            <Route
              path="/store-owner-dashboard"
              element={
                <Layout requireAuth={true} allowedRoles={["owner"]}>
                  <StoreOwnerDashboard />
                </Layout>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./components/layout/AuthLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <AuthLayout>
                <LandingPage />
              </AuthLayout>
            } />
            <Route path="/login" element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            <Route path="/register" element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            } />
            <Route path="/forgot-password" element={
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            } />
            
            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={
              <AuthLayout requireAuth>
                <Dashboard />
              </AuthLayout>
            } />
            <Route path="/profile" element={
              <AuthLayout requireAuth>
                <Profile />
              </AuthLayout>
            } />
            <Route path="/wallet" element={
              <AuthLayout requireAuth>
                <Wallet />
              </AuthLayout>
            } />
            <Route path="/settings" element={
              <AuthLayout requireAuth>
                <Settings />
              </AuthLayout>
            } />
            
            {/* Admin routes - require admin role */}
            <Route path="/admin" element={
              <AuthLayout requireAuth requireAdmin>
                <Admin />
              </AuthLayout>
            } />
            <Route path="/admin/users" element={
              <AuthLayout requireAuth requireAdmin>
                <AdminUsers />
              </AuthLayout>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

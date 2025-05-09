
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type AuthLayoutProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-gentle text-2xl font-semibold text-trading-primary">
          Loading...
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && (!isAuthenticated || !user?.isAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthLayout;

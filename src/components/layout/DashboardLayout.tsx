
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  LogOut, 
  Settings, 
  CreditCard, 
  Users, 
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin || false;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Wallet', href: '/wallet', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];
  
  const adminItems = [
    { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 flex-col border-r bg-card p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-10 w-10 rounded-md bg-trading-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">WH</span>
          </div>
          <h1 className="text-xl font-bold">Wealth Haven</h1>
        </div>
        
        <div className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent transition-colors",
                location.pathname === item.href ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
              )}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
          
          {isAdmin && (
            <>
              <Separator className="my-2" />
              <p className="text-xs uppercase font-medium text-muted-foreground px-3 py-1">
                Admin
              </p>
              {adminItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent transition-colors",
                    location.pathname === item.href ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </>
          )}
        </div>
        
        <div className="mt-auto">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
          
          <div className="mt-4 p-3 border rounded-md">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile navbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-trading-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">WH</span>
          </div>
          <h1 className="text-lg font-bold">Wealth Haven</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut size={18} />
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-4 md:p-8">
        {children}
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden flex border-t bg-card">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex-1 flex flex-col items-center py-2 text-xs",
              location.pathname === item.href ? "text-trading-primary" : "text-muted-foreground"
            )}
          >
            <item.icon size={18} />
            <span className="mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardLayout;

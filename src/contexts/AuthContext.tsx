
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycVerified: boolean;
  kycDocument: string;
  isAdmin?: boolean;
  createdAt: string;
};

export type UserBalance = {
  BTC: number;
  ETH: number;
  XRP: number;
  USD: number;
  GBP: number;
  EUR: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  balance: UserBalance;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  submitKYC: (documentType: string, documentId: string) => Promise<boolean>;
};

// Mock data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '1234567890',
    kycVerified: true,
    kycDocument: 'ID12345',
    isAdmin: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'user@example.com',
    phone: '0987654321',
    kycVerified: true,
    kycDocument: 'DL54321',
    createdAt: new Date().toISOString(),
  },
];

const MOCK_BALANCES: Record<string, UserBalance> = {
  '1': {
    BTC: 2.5,
    ETH: 10,
    XRP: 5000,
    USD: 10000,
    GBP: 8000,
    EUR: 9000,
  },
  '2': {
    BTC: 0.5,
    ETH: 5,
    XRP: 2000,
    USD: 5000,
    GBP: 4000,
    EUR: 4500,
  },
};

const DEFAULT_BALANCE: UserBalance = {
  BTC: 0,
  ETH: 0,
  XRP: 0,
  USD: 0,
  GBP: 0,
  EUR: 0,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<UserBalance>(DEFAULT_BALANCE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('tradingUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Load balance for this user
        const userBalance = MOCK_BALANCES[parsedUser.id] || DEFAULT_BALANCE;
        setBalance(userBalance);
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('tradingUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    setIsLoading(true);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser) {
      // In real app, check password hash here
      setUser(foundUser);
      localStorage.setItem('tradingUser', JSON.stringify(foundUser));
      
      // Load balance for this user
      const userBalance = MOCK_BALANCES[foundUser.id] || DEFAULT_BALANCE;
      setBalance(userBalance);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      setIsLoading(false);
      return true;
    }
    
    toast({
      title: "Login Failed",
      description: "Invalid email or password. Please try again.",
      variant: "destructive"
    });
    
    setIsLoading(false);
    return false;
  };

  const register = async (
    name: string, 
    email: string, 
    phone: string, 
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      toast({
        title: "Registration Failed",
        description: "Email already exists. Please use another email.",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `${MOCK_USERS.length + 1}`,
      name,
      email,
      phone,
      kycVerified: false,
      kycDocument: '',
      createdAt: new Date().toISOString(),
    };
    
    // In a real app, we would make an API call to register
    MOCK_USERS.push(newUser);
    
    // Initialize balance for new user
    MOCK_BALANCES[newUser.id] = { ...DEFAULT_BALANCE };
    
    setUser(newUser);
    localStorage.setItem('tradingUser', JSON.stringify(newUser));
    setBalance(DEFAULT_BALANCE);
    
    toast({
      title: "Registration Successful",
      description: "Your account has been created. Please complete KYC verification.",
    });
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setBalance(DEFAULT_BALANCE);
    localStorage.removeItem('tradingUser');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user
    const updatedUser = { ...user, ...updates };
    
    // Update in mock data
    const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = updatedUser;
    }
    
    setUser(updatedUser);
    localStorage.setItem('tradingUser', JSON.stringify(updatedUser));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    
    setIsLoading(false);
    return true;
  };

  const submitKYC = async (documentType: string, documentId: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user
    const updatedUser = { 
      ...user, 
      kycDocument: documentId, 
      kycVerified: true 
    };
    
    // Update in mock data
    const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = updatedUser;
    }
    
    setUser(updatedUser);
    localStorage.setItem('tradingUser', JSON.stringify(updatedUser));
    
    toast({
      title: "KYC Submitted",
      description: `Your ${documentType} verification has been approved.`,
    });
    
    setIsLoading(false);
    return true;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    balance,
    login,
    register,
    logout,
    updateProfile,
    submitKYC,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Admin context to export mock data for the admin dashboard
export const useMockData = () => {
  return {
    users: MOCK_USERS,
    balances: MOCK_BALANCES,
    updateUserBalance: (userId: string, asset: keyof UserBalance, amount: number) => {
      if (MOCK_BALANCES[userId]) {
        MOCK_BALANCES[userId][asset] = amount;
      }
    }
  };
};

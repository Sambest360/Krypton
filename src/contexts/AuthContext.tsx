import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  UserBalance,
  getUserByEmail,
  getUserById,
  getUserBalance,
  createUser,
  verifyPassword,
  updateUser,
  updateUserBalance
} from '@/lib/db/users';

// Re-export types from db/users
export type { User, UserBalance } from '@/lib/db/users';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  balance: UserBalance | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  submitKYC: (documentType: string, documentId: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Load user balance
  const loadUserBalance = async (userId: string) => {
    try {
      const userBalance = await getUserBalance(userId);
      setBalance(userBalance);
    } catch (error) {
      console.error('Failed to load user balance:', error);
      toast({
        title: "Error",
        description: "Failed to load balance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const loadStoredUser = async () => {
      const storedUserId = localStorage.getItem('tradingUserId');
      if (storedUserId) {
        try {
          const dbUser = await getUserById(storedUserId);
          if (dbUser) {
            setUser(dbUser);
            await loadUserBalance(dbUser.id);
          } else {
            localStorage.removeItem('tradingUserId');
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
          localStorage.removeItem('tradingUserId');
        }
      }
      setIsLoading(false);
    };

    loadStoredUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const dbUser = await getUserByEmail(email);
      
      if (!dbUser) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      const isValidPassword = await verifyPassword(dbUser, password);
      
      if (!isValidPassword) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      setUser(dbUser);
      localStorage.setItem('tradingUserId', dbUser.id);
      
      await loadUserBalance(dbUser.id);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${dbUser.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return null;
  };

  const register = async (
    name: string, 
    email: string, 
    phone: string, 
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Validate password first
      const passwordError = validatePassword(password);
      if (passwordError) {
        toast({
          title: "Invalid Password",
          description: passwordError,
          variant: "destructive"
        });
        return false;
      }

      // Check if user exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        toast({
          title: "Account Already Exists",
          description: "The email address you entered is already registered. Please use a different email or try logging in.",
          variant: "destructive"
        });
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        return false;
      }

      // Validate phone number (basic validation)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number.",
          variant: "destructive"
        });
        return false;
      }

      // All validations passed, create user
      const newUser = await createUser(name, email, phone, password);
      setUser(newUser);
      localStorage.setItem('tradingUserId', newUser.id);
      
      await loadUserBalance(newUser.id);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please complete KYC verification.",
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setBalance(null);
    localStorage.removeItem('tradingUserId');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const updatedUser = await updateUser(user.id, updates);
      setUser(updatedUser);
      localStorage.setItem('tradingUserId', updatedUser.id);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Update Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const dbUser = await getUserByEmail(email);

      if (!dbUser) {
        toast({
          title: "Reset Password Failed",
          description: "No account found with this email address.",
          variant: "destructive"
        });
        return false;
      }

      // In a real app, this would send a password reset email
      toast({
        title: "Reset Instructions Sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
      });

      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Reset Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const submitKYC = async (documentType: string, documentId: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const updatedUser = await updateUser(user.id, {
        kyc_document: documentId,
        kyc_verified: true
      });
      
      setUser(updatedUser);
      localStorage.setItem('tradingUserId', updatedUser.id);
      
      toast({
        title: "KYC Submitted",
        description: `Your ${documentType} verification has been approved.`,
      });
      
      return true;
    } catch (error) {
      console.error('KYC submission error:', error);
      toast({
        title: "KYC Submission Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
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
    resetPassword,
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
    users: [],
    balances: {},
    updateUserBalance: (userId: string, asset: keyof UserBalance, amount: number) => {
      // No-op
    }
  };
};

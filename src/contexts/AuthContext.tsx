import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, ApiResponse } from '@/types';
import { authApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ApiResponse<{ user: User; token: string }>>;
  register: (data: RegisterData) => Promise<ApiResponse<{ user: User; token: string }>>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<ApiResponse<User>>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<ApiResponse<void>>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const userData = localStorage.getItem(USER_KEY);
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await authApi.login(email, password);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setUser(user);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    }
  };

  const register = async (data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await authApi.register(data);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setUser(user);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    window.location.href = '/';
  };

  const updateProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await authApi.updateProfile(data);
      
      if (response.success && response.data) {
        const updatedUser = { ...user, ...response.data } as User;
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update profile.',
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    try {
      return await authApi.changePassword(currentPassword, newPassword);
    } catch (error) {
      return {
        success: false,
        message: 'Failed to change password.',
      };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

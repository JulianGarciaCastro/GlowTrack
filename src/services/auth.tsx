/**
 * Authentication Service & Context
 * Manages user authentication state and operations
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, SecureStorage } from '../sdk/api';
import { UserRole, Patient, Professional } from '../types';

// ============================================================================
// Types
// ============================================================================

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  profile: Patient | Professional;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  dateOfBirth?: Date;
  specialty?: string;
  licenseNumber?: string;
  licenseAuthority?: string;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ============================================================================
// Provider
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = await SecureStorage.getAuthToken();
      if (token) {
        apiClient.setAuthToken(token);
        await fetchCurrentUser();
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      // This would call an API endpoint to get current user
      // For now, we'll simulate it
      const response = await apiClient.request('/auth/me', { method: 'GET' });
      if (response.success && response.data) {
        setUser(response.data as AuthUser);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Login failed');
      }

      const { token, refreshToken, user: userData } = response.data as any;

      // Save tokens
      await SecureStorage.saveAuthToken(token);
      await SecureStorage.saveRefreshToken(refreshToken);

      // Set token in API client
      apiClient.setAuthToken(token);

      // Set user
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiClient.register(data);
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Registration failed');
      }

      const { token, refreshToken, user: userData } = response.data as any;

      // Save tokens
      await SecureStorage.saveAuthToken(token);
      await SecureStorage.saveRefreshToken(refreshToken);

      // Set token in API client
      apiClient.setAuthToken(token);

      // Set user
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state
      await SecureStorage.clearAll();
      apiClient.setAuthToken('');
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

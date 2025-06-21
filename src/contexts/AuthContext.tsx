
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';
import { AuthStorage } from '../utils/authStorage';
import { AuthService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = AuthStorage.getCurrentUser();
    if (savedUser) {
      // Sync user data with registered users list if it exists
      const syncedUser = AuthStorage.syncUserWithRegisteredList(savedUser);
      if (syncedUser !== savedUser) {
        AuthStorage.setCurrentUser(syncedUser);
      }
      setUser(syncedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email
      const foundUser = AuthService.findUserByEmail(email);
      
      if (!foundUser) {
        setIsLoading(false);
        return { success: false, message: "Account not found. Please check your email address." };
      }
      
      // Check password
      if (!AuthService.checkPassword(email, password)) {
        // Track failed login attempt
        AuthStorage.incrementLoginAttempts(email);
        setIsLoading(false);
        return { success: false, message: "Incorrect password. Please try again." };
      }
      
      // Clear failed login attempts on successful login
      AuthStorage.clearLoginAttempts(email);
      
      // Update last login date
      const updatedUser = AuthService.updateUserLastLogin(foundUser);
      
      setUser(updatedUser);
      setIsLoading(false);
      return { success: true, message: "Login successful!" };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: "An error occurred during login. Please try again." };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate email format
      if (!AuthService.validateEmail(email)) {
        setIsLoading(false);
        return { success: false, message: "Please enter a valid email address." };
      }
      
      // Validate password strength
      if (!AuthService.validatePassword(password)) {
        setIsLoading(false);
        return { success: false, message: "Password must be at least 6 characters long." };
      }
      
      // Check if email already exists
      const existingUser = AuthService.findUserByEmail(email);
      if (existingUser) {
        setIsLoading(false);
        return { success: false, message: "This email address is already registered. Please use a different email or try logging in." };
      }
      
      // Create new user with $0 balance
      const userData = AuthService.createUser(name, email, password);
      
      // Register user and trigger events
      AuthService.registerUser(userData, password);
      
      // Set current user
      setUser(userData);
      
      setIsLoading(false);
      return { success: true, message: "Account created successfully! Welcome to CapitalEngine." };
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return { success: false, message: "An error occurred during registration. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    AuthStorage.clearCurrentUser();
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      resetPassword,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

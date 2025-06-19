
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  balance?: number;
  registrationDate?: string;
  lastLoginDate?: string;
  loginAttempts?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('capitalengine_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Sync user data with registered users list if it exists
      const registeredUsers = localStorage.getItem('capitalengine_registered_users');
      if (registeredUsers) {
        const users: User[] = JSON.parse(registeredUsers);
        const updatedUser = users.find(u => u.id === userData.id);
        if (updatedUser) {
          setUser(updatedUser);
          localStorage.setItem('capitalengine_user', JSON.stringify(updatedUser));
        } else {
          setUser(userData);
        }
      } else {
        setUser(userData);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get registered users
      const existingUsers = localStorage.getItem('capitalengine_registered_users');
      const users: User[] = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Find user by email
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        setIsLoading(false);
        return { success: false, message: "Account not found. Please check your email address." };
      }
      
      // Get stored passwords
      const storedPasswords = localStorage.getItem('capitalengine_passwords');
      const passwords: { [email: string]: string } = storedPasswords ? JSON.parse(storedPasswords) : {};
      
      // Check password
      if (passwords[email.toLowerCase()] !== password) {
        // Track failed login attempt
        const loginAttempts = localStorage.getItem('capitalengine_login_attempts');
        const attempts: { [email: string]: number } = loginAttempts ? JSON.parse(loginAttempts) : {};
        attempts[email.toLowerCase()] = (attempts[email.toLowerCase()] || 0) + 1;
        localStorage.setItem('capitalengine_login_attempts', JSON.stringify(attempts));
        
        setIsLoading(false);
        return { success: false, message: "Incorrect password. Please try again." };
      }
      
      // Clear failed login attempts on successful login
      const loginAttempts = localStorage.getItem('capitalengine_login_attempts');
      if (loginAttempts) {
        const attempts: { [email: string]: number } = JSON.parse(loginAttempts);
        delete attempts[email.toLowerCase()];
        localStorage.setItem('capitalengine_login_attempts', JSON.stringify(attempts));
      }
      
      // Update last login date
      const updatedUser = {
        ...foundUser,
        lastLoginDate: new Date().toISOString()
      };
      
      // Update user in registered users list
      const updatedUsers = users.map(u => u.email.toLowerCase() === email.toLowerCase() ? updatedUser : u);
      localStorage.setItem('capitalengine_registered_users', JSON.stringify(updatedUsers));
      
      setUser(updatedUser);
      localStorage.setItem('capitalengine_user', JSON.stringify(updatedUser));
      localStorage.setItem('capitalengine_balance', (updatedUser.balance || 0).toString());
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setIsLoading(false);
        return { success: false, message: "Please enter a valid email address." };
      }
      
      // Validate password strength
      if (password.length < 6) {
        setIsLoading(false);
        return { success: false, message: "Password must be at least 6 characters long." };
      }
      
      // Check if email already exists
      const existingUsers = localStorage.getItem('capitalengine_registered_users');
      const users: User[] = existingUsers ? JSON.parse(existingUsers) : [];
      
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setIsLoading(false);
        return { success: false, message: "This email address is already registered. Please use a different email or try logging in." };
      }
      
      // Create new user with $0 balance (always start with $0)
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: email.toLowerCase(),
        name,
        balance: 0, // Always start with $0 - no exceptions
        registrationDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString()
      };
      
      // Add user to registered users list
      const updatedUsers = [...users, userData];
      
      // Update storage immediately for real-time sync
      localStorage.setItem('capitalengine_registered_users', JSON.stringify(updatedUsers));
      
      // Store password separately for security
      const storedPasswords = localStorage.getItem('capitalengine_passwords');
      const passwords: { [email: string]: string } = storedPasswords ? JSON.parse(storedPasswords) : {};
      passwords[email.toLowerCase()] = password;
      localStorage.setItem('capitalengine_passwords', JSON.stringify(passwords));
      
      // Set current user
      setUser(userData);
      localStorage.setItem('capitalengine_user', JSON.stringify(userData));
      localStorage.setItem('capitalengine_balance', '0'); // Initialize with $0
      
      console.log('New user registered:', userData);
      console.log('All registered users after registration:', updatedUsers);
      
      // Dispatch registration event immediately for admin panel
      const registrationEvent = new CustomEvent('userRegistered', { 
        detail: { 
          user: userData, 
          allUsers: updatedUsers,
          timestamp: new Date().toISOString()
        } 
      });
      
      // Dispatch multiple times to ensure admin panel catches it
      window.dispatchEvent(registrationEvent);
      setTimeout(() => window.dispatchEvent(registrationEvent), 100);
      setTimeout(() => window.dispatchEvent(registrationEvent), 500);
      
      console.log('User registration event dispatched for admin panel sync');
      
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
    localStorage.removeItem('capitalengine_user');
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

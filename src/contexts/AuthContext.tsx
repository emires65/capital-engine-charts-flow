import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0]
      };
      
      setUser(userData);
      localStorage.setItem('capitalengine_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name
      };
      
      // Save to registered users list for admin panel
      const existingUsers = localStorage.getItem('capitalengine_registered_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const newUser = {
        ...userData,
        balance: 0,
        registrationDate: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('capitalengine_registered_users', JSON.stringify(users));
      
      setUser(userData);
      localStorage.setItem('capitalengine_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
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

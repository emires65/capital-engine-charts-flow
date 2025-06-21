
export interface User {
  id: string;
  email: string;
  name: string;
  balance?: number;
  registrationDate?: string;
  lastLoginDate?: string;
  loginAttempts?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

export interface LoginAttempts {
  [email: string]: number;
}

export interface StoredPasswords {
  [email: string]: string;
}

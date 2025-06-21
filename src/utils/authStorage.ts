
import { User, LoginAttempts, StoredPasswords } from '../types/auth';

export const AuthStorage = {
  // User management
  getRegisteredUsers: (): User[] => {
    const existingUsers = localStorage.getItem('capitalengine_registered_users');
    return existingUsers ? JSON.parse(existingUsers) : [];
  },

  setRegisteredUsers: (users: User[]): void => {
    localStorage.setItem('capitalengine_registered_users', JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const savedUser = localStorage.getItem('capitalengine_user');
    return savedUser ? JSON.parse(savedUser) : null;
  },

  setCurrentUser: (user: User): void => {
    localStorage.setItem('capitalengine_user', JSON.stringify(user));
    localStorage.setItem('capitalengine_balance', (user.balance || 0).toString());
  },

  clearCurrentUser: (): void => {
    localStorage.removeItem('capitalengine_user');
  },

  // Password management
  getStoredPasswords: (): StoredPasswords => {
    const storedPasswords = localStorage.getItem('capitalengine_passwords');
    return storedPasswords ? JSON.parse(storedPasswords) : {};
  },

  setPassword: (email: string, password: string): void => {
    const passwords = AuthStorage.getStoredPasswords();
    passwords[email.toLowerCase()] = password;
    localStorage.setItem('capitalengine_passwords', JSON.stringify(passwords));
  },

  // Login attempts management
  getLoginAttempts: (): LoginAttempts => {
    const loginAttempts = localStorage.getItem('capitalengine_login_attempts');
    return loginAttempts ? JSON.parse(loginAttempts) : {};
  },

  incrementLoginAttempts: (email: string): void => {
    const attempts = AuthStorage.getLoginAttempts();
    attempts[email.toLowerCase()] = (attempts[email.toLowerCase()] || 0) + 1;
    localStorage.setItem('capitalengine_login_attempts', JSON.stringify(attempts));
  },

  clearLoginAttempts: (email: string): void => {
    const attempts = AuthStorage.getLoginAttempts();
    delete attempts[email.toLowerCase()];
    localStorage.setItem('capitalengine_login_attempts', JSON.stringify(attempts));
  },

  // User synchronization
  syncUserWithRegisteredList: (userData: User): User => {
    const registeredUsers = AuthStorage.getRegisteredUsers();
    const updatedUser = registeredUsers.find(u => u.id === userData.id);
    return updatedUser || userData;
  }
};

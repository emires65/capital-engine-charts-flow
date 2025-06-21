
import { User } from '../types/auth';
import { AuthStorage } from '../utils/authStorage';
import { AuthEvents } from '../utils/authEvents';

export const AuthService = {
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password: string): boolean => {
    return password.length >= 6;
  },

  findUserByEmail: (email: string): User | null => {
    const users = AuthStorage.getRegisteredUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  checkPassword: (email: string, password: string): boolean => {
    const passwords = AuthStorage.getStoredPasswords();
    return passwords[email.toLowerCase()] === password;
  },

  createUser: (name: string, email: string, password: string): User => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      name,
      balance: 0,
      registrationDate: new Date().toISOString(),
      lastLoginDate: new Date().toISOString()
    };
  },

  registerUser: (userData: User, password: string): User[] => {
    const users = AuthStorage.getRegisteredUsers();
    const updatedUsers = [...users, userData];
    
    // Update storage immediately
    AuthStorage.setRegisteredUsers(updatedUsers);
    AuthStorage.setPassword(userData.email, password);
    AuthStorage.setCurrentUser(userData);
    
    // Dispatch events for admin panel sync
    AuthEvents.dispatchUserRegistration(userData, updatedUsers);
    
    return updatedUsers;
  },

  updateUserLastLogin: (user: User): User => {
    const updatedUser = {
      ...user,
      lastLoginDate: new Date().toISOString()
    };
    
    // Update user in registered users list
    const users = AuthStorage.getRegisteredUsers();
    const updatedUsers = users.map(u => 
      u.email.toLowerCase() === user.email.toLowerCase() ? updatedUser : u
    );
    
    AuthStorage.setRegisteredUsers(updatedUsers);
    AuthStorage.setCurrentUser(updatedUser);
    
    return updatedUser;
  }
};

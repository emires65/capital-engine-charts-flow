
import { User } from '../types/auth';

export const AuthEvents = {
  dispatchUserRegistration: (userData: User, allUsers: User[]): void => {
    console.log('🟢 NEW USER REGISTERED:', userData);
    console.log('🟢 UPDATED USERS LIST:', allUsers);
    console.log('🟢 STORAGE UPDATED - TRIGGERING ADMIN SYNC');

    const triggerAdminSync = () => {
      // Dispatch custom events with detailed information
      const registrationEvent = new CustomEvent('userRegistered', { 
        detail: { 
          user: userData, 
          allUsers: allUsers,
          timestamp: new Date().toISOString(),
          action: 'NEW_USER_REGISTERED'
        } 
      });
      
      const storageEvent = new CustomEvent('adminDataUpdate', {
        detail: {
          type: 'USER_REGISTRATION',
          user: userData,
          allUsers: allUsers,
          timestamp: new Date().toISOString()
        }
      });
      
      // Dispatch both events
      window.dispatchEvent(registrationEvent);
      window.dispatchEvent(storageEvent);
      
      // Force storage event for cross-tab communication
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'capitalengine_registered_users',
        newValue: JSON.stringify(allUsers),
        oldValue: JSON.stringify(allUsers.slice(0, -1))
      }));
      
      console.log('🔥 ADMIN SYNC EVENTS DISPATCHED');
    };
    
    // Dispatch events multiple times with intervals for reliability
    triggerAdminSync();
    setTimeout(triggerAdminSync, 100);
    setTimeout(triggerAdminSync, 300);
    setTimeout(triggerAdminSync, 500);
    setTimeout(triggerAdminSync, 1000);
    setTimeout(triggerAdminSync, 2000);
  }
};

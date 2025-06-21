import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '../hooks/use-toast';
import AdminLogin from '../components/AdminLogin';
import UserManagement from '../components/UserManagement';
import DepositApproval from '../components/DepositApproval';

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  registrationDate: string;
  lastLoginDate?: string;
  loginAttempts?: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  btcAmount?: number;
  txHash?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'deposits'>('users');
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🟢 ADMIN PANEL INITIALIZING - Setting up real-time sync');
      
      // Initial load
      loadUsers();
      loadTransactions();
      
      // Enhanced real-time polling - check every 500ms for immediate updates
      const rapidPolling = setInterval(() => {
        loadUsers();
        loadTransactions();
      }, 500);
      
      // Enhanced event listeners for better real-time sync
      const handleUserRegistration = (event: any) => {
        console.log('🔥 ADMIN DETECTED NEW USER REGISTRATION:', event.detail);
        
        // Show immediate toast notification
        if (event.detail?.user) {
          toast({
            title: "🎉 NEW USER REGISTERED!",
            description: `${event.detail.user.name} (${event.detail.user.email}) just joined with $0 balance!`,
          });
        }
        
        // Force immediate reload
        setTimeout(() => {
          loadUsers();
          console.log('✅ Users reloaded after registration');
        }, 50);
      };

      const handleAdminDataUpdate = (event: any) => {
        console.log('🔥 ADMIN DATA UPDATE EVENT:', event.detail);
        
        if (event.detail?.type === 'USER_REGISTRATION') {
          loadUsers();
          toast({
            title: "📊 Admin Data Updated",
            description: "New user data synchronized!",
          });
        }
      };

      const handleNewTransaction = (event: any) => {
        console.log('🔥 ADMIN DETECTED NEW TRANSACTION:', event.detail);
        setTimeout(() => {
          loadTransactions();
        }, 50);
        
        if (event.detail?.transaction) {
          toast({
            title: "💰 New Transaction",
            description: `New ${event.detail.transaction.type} of $${event.detail.transaction.amount}`,
          });
        }
      };
      
      // Enhanced storage change detection
      const handleStorageChange = (e: any) => {
        console.log('🔥 STORAGE CHANGE DETECTED:', e.key);
        if (e.key === 'capitalengine_registered_users') {
          console.log('📊 Users storage changed - reloading');
          loadUsers();
        }
        if (e.key === 'capitalengine_all_transactions') {
          console.log('💰 Transaction storage changed - reloading');
          loadTransactions();
        }
      };
      
      // Add all event listeners
      window.addEventListener('userRegistered', handleUserRegistration);
      window.addEventListener('adminDataUpdate', handleAdminDataUpdate);
      window.addEventListener('newTransaction', handleNewTransaction);
      window.addEventListener('storage', handleStorageChange);
      
      // Force check for existing data on mount
      setTimeout(() => {
        console.log('🔍 FORCE CHECKING FOR EXISTING DATA');
        loadUsers();
        loadTransactions();
      }, 100);
      
      return () => {
        clearInterval(rapidPolling);
        window.removeEventListener('userRegistered', handleUserRegistration);
        window.removeEventListener('adminDataUpdate', handleAdminDataUpdate);
        window.removeEventListener('newTransaction', handleNewTransaction);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [isAuthenticated, toast]);

  const loadUsers = () => {
    try {
      const registeredUsers = localStorage.getItem('capitalengine_registered_users');
      console.log('📊 LOADING USERS FROM STORAGE:', registeredUsers);
      
      if (registeredUsers) {
        const parsedUsers = JSON.parse(registeredUsers);
        console.log('✅ PARSED USERS:', parsedUsers);
        
        const formattedUsers: User[] = parsedUsers.map((user: any) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          balance: user.balance || 0,
          registrationDate: user.registrationDate || new Date().toISOString(),
          lastLoginDate: user.lastLoginDate,
          loginAttempts: user.loginAttempts || 0
        }));
        
        console.log('🟢 SETTING USERS IN ADMIN PANEL:', formattedUsers);
        setUsers(formattedUsers);
      } else {
        console.log('❌ NO REGISTERED USERS FOUND');
        setUsers([]);
      }
    } catch (error) {
      console.error('❌ ERROR LOADING USERS:', error);
      setUsers([]);
    }
  };

  const loadTransactions = () => {
    try {
      const globalTransactions = localStorage.getItem('capitalengine_all_transactions');
      if (globalTransactions) {
        const parsedTransactions = JSON.parse(globalTransactions);
        console.log('💰 Loaded transactions:', parsedTransactions);
        setTransactions(parsedTransactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('❌ Error loading transactions:', error);
      setTransactions([]);
    }
  };

  const updateUserBalance = async (userId: string, amount: number): Promise<void> => {
    try {
      // Update users array
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, balance: amount }
          : user
      );

      setUsers(updatedUsers);
      
      // Update all storage locations to keep them in sync
      localStorage.setItem('capitalengine_registered_users', JSON.stringify(updatedUsers));

      // Update the balance for the currently logged-in user if they are the selected user
      const currentUser = localStorage.getItem('capitalengine_user');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.id === userId) {
          userData.balance = amount;
          localStorage.setItem('capitalengine_user', JSON.stringify(userData));
          localStorage.setItem('capitalengine_balance', amount.toString());
        }
      }

      // Trigger event to notify user dashboard of balance change
      window.dispatchEvent(new CustomEvent('balanceUpdated', { 
        detail: { userId: userId, newBalance: amount } 
      }));

      toast({
        title: "Success",
        description: `Balance updated to $${amount.toFixed(2)} successfully. User will see the change immediately.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user balance.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const approveTransaction = (transactionId: string, status: 'completed' | 'failed') => {
    console.log(`🔥 APPROVING TRANSACTION ${transactionId} as ${status}`);
    
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === transactionId ? { ...transaction, status } : transaction
    );
    
    setTransactions(updatedTransactions);
    localStorage.setItem('capitalengine_all_transactions', JSON.stringify(updatedTransactions));

    // If deposit is completed, update user balance
    if (status === 'completed') {
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction && transaction.type === 'deposit' && transaction.userId) {
        console.log(`💰 DEPOSIT APPROVED - Adding $${transaction.amount} to user balance`);
        
        const updatedUsers = users.map(user => 
          user.id === transaction.userId 
            ? { ...user, balance: user.balance + transaction.amount }
            : user
        );
        
        setUsers(updatedUsers);
        localStorage.setItem('capitalengine_registered_users', JSON.stringify(updatedUsers));

        // Update current user if they are the transaction owner
        const currentUser = localStorage.getItem('capitalengine_user');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          if (userData.id === transaction.userId) {
            userData.balance += transaction.amount;
            localStorage.setItem('capitalengine_user', JSON.stringify(userData));
            localStorage.setItem('capitalengine_balance', userData.balance.toString());
          }
        }

        // Trigger balance update event
        window.dispatchEvent(new CustomEvent('balanceUpdated', { 
          detail: { userId: transaction.userId, newBalance: updatedUsers.find(u => u.id === transaction.userId)?.balance } 
        }));
      }
    }

    toast({
      title: status === 'completed' ? "✅ Transaction Approved" : "❌ Transaction Rejected",
      description: `Deposit has been marked as ${status}.`,
    });
  };

  const handleSelectUserForFunding = (userId: string, currentBalance: number) => {
    setSelectedUser(userId);
    setBalanceAmount(currentBalance.toString());
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              CapitalEngine Admin Panel
            </h1>
            <p className="text-slate-400">
              🔴 LIVE: Real-time user management & deposit approval
            </p>
            <p className="text-slate-300 text-sm mt-1">
              Total Users: {users.length} | Pending Deposits: {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length} | ⚡ Auto-sync every 500ms
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => {
                localStorage.clear();
                setUsers([]);
                setTransactions([]);
                toast({ title: "🗑️ All Data Cleared", description: "Database wiped clean!" });
              }}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              🗑️ Clear All Data
            </Button>
            <Button 
              onClick={() => {
                loadUsers();
                loadTransactions();
                toast({ title: "🔄 Data Refreshed", description: "All data reloaded!" });
              }}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              🔄 Refresh Data
            </Button>
            <Button 
              onClick={() => setIsAuthenticated(false)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-4">
            <Button
              onClick={() => setActiveTab('users')}
              variant={activeTab === 'users' ? 'default' : 'outline'}
              className={activeTab === 'users' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
            >
              👥 User Management ({users.length})
            </Button>
            <Button
              onClick={() => setActiveTab('deposits')}
              variant={activeTab === 'deposits' ? 'default' : 'outline'}
              className={activeTab === 'deposits' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
            >
              💰 Deposit Approval ({transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length})
            </Button>
          </div>
        </div>

        {activeTab === 'users' && (
          <UserManagement 
            users={users}
            transactions={transactions}
            onUpdateBalance={updateUserBalance}
            onSelectUserForFunding={handleSelectUserForFunding}
          />
        )}

        {activeTab === 'deposits' && (
          <DepositApproval 
            transactions={transactions}
            onApproveTransaction={approveTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;

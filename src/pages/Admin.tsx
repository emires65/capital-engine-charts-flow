import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AdminLogin from '../components/AdminLogin';

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
  const [loading, setLoading] = useState(false);
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

  const updateUserBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !balanceAmount) {
      toast({
        title: "Error",
        description: "Please select a user and enter a balance amount.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Update users array
      const updatedUsers = users.map(user => 
        user.id === selectedUser 
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
        if (userData.id === selectedUser) {
          userData.balance = amount;
          localStorage.setItem('capitalengine_user', JSON.stringify(userData));
          localStorage.setItem('capitalengine_balance', amount.toString());
        }
      }

      // Trigger event to notify user dashboard of balance change
      window.dispatchEvent(new CustomEvent('balanceUpdated', { 
        detail: { userId: selectedUser, newBalance: amount } 
      }));

      toast({
        title: "Success",
        description: `Balance updated to $${amount.toFixed(2)} successfully. User will see the change immediately.`,
      });

      setSelectedUser('');
      setBalanceAmount('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user balance.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const refreshData = () => {
    console.log('Manual refresh triggered');
    loadUsers();
    loadTransactions();
    toast({
      title: "Data Refreshed! 🔄",
      description: "All data has been reloaded from storage.",
    });
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL user data? This action cannot be undone.')) {
      // Clear all localStorage data
      const keysToRemove = [
        'capitalengine_registered_users',
        'capitalengine_passwords',
        'capitalengine_user',
        'capitalengine_balance',
        'capitalengine_transactions',
        'capitalengine_all_transactions',
        'capitalengine_login_attempts'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Removed ${key} from localStorage`);
      });
      
      // Clear state
      setUsers([]);
      setTransactions([]);
      setSelectedUser('');
      setBalanceAmount('');
      
      toast({
        title: "All Data Cleared! 🗑️",
        description: "Database wiped clean. Ready for fresh testing!",
      });
      
      console.log('All user data cleared from localStorage');
    }
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
          <>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Balance Update Form */}
              <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Update User Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={updateUserBalance} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-2">
                        Select User
                      </label>
                      <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Choose a user...</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email}) - Current: {formatAmount(user.balance)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-2">
                        New Balance (USD)
                      </label>
                      <Input
                        type="number"
                        value={balanceAmount}
                        onChange={(e) => setBalanceAmount(e.target.value)}
                        placeholder="Enter new balance"
                        min="0"
                        step="0.01"
                        required
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Balance'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* User Statistics */}
              <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">📊 Live Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">👥 Total Users</span>
                      <span className="text-white font-bold text-xl">{users.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">💰 Total Balance Pool</span>
                      <span className="text-emerald-400 font-bold text-xl">
                        {formatAmount(users.reduce((sum, user) => sum + user.balance, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">⏳ Pending Deposits</span>
                      <span className="text-yellow-400 font-bold text-xl">
                        {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">📊 Total Transactions</span>
                      <span className="text-purple-400 font-bold text-xl">
                        {transactions.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm mt-8">
              <CardHeader>
                <CardTitle className="text-white">
                  🔴 LIVE: All Registered Users (Updates every 500ms)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-xl mb-2">No users registered yet.</p>
                    <p className="text-sm">Users will appear here automatically when they register on the main website.</p>
                    <p className="text-xs mt-2 text-slate-500">🔴 Live sync active - Updates every 500ms</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-300">Name</TableHead>
                        <TableHead className="text-slate-300">Email</TableHead>
                        <TableHead className="text-slate-300">Balance</TableHead>
                        <TableHead className="text-slate-300">Registration Date</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="text-white font-medium">{user.name}</TableCell>
                          <TableCell className="text-slate-300">{user.email}</TableCell>
                          <TableCell className="text-emerald-400 font-bold">
                            ${user.balance.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-slate-400">
                            {new Date(user.registrationDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user.id);
                                setBalanceAmount(user.balance.toString());
                              }}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              💰 Fund User
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'deposits' && (
          <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">
                💰 Deposit Approval - Live Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.filter(t => t.type === 'deposit').length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <div className="text-6xl mb-4">💳</div>
                  <p className="text-xl mb-2">No deposit transactions found.</p>
                  <p className="text-sm">Deposits will appear here when users make them.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-300">User</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Amount</TableHead>
                      <TableHead className="text-slate-300">BTC Amount</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions
                      .filter(t => t.type === 'deposit')
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-white">{transaction.userName || 'Unknown'}</TableCell>
                          <TableCell className="text-slate-300">{transaction.userEmail || 'Unknown'}</TableCell>
                          <TableCell className="text-emerald-400 font-medium">
                            {formatAmount(transaction.amount)}
                          </TableCell>
                          <TableCell className="text-orange-400">
                            {transaction.btcAmount ? `${transaction.btcAmount.toFixed(8)} BTC` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-slate-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                transaction.status === 'completed' ? 'default' : 
                                transaction.status === 'failed' ? 'destructive' : 
                                'secondary'
                              }
                              className={
                                transaction.status === 'completed' ? 'bg-green-600' :
                                transaction.status === 'failed' ? 'bg-red-600' :
                                'bg-yellow-600'
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transaction.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => approveTransaction(transaction.id, 'completed')}
                                  className="border-green-600 text-green-400 hover:bg-green-900/20"
                                >
                                  ✅ Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => approveTransaction(transaction.id, 'failed')}
                                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                                >
                                  ❌ Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;

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
      loadUsers();
      loadTransactions();
      
      // Set up interval to refresh data every 2 seconds for better real-time sync
      const interval = setInterval(() => {
        loadUsers();
        loadTransactions();
      }, 2000);
      
      // Listen for new user registrations from the main website
      const handleUserRegistration = (event: CustomEvent) => {
        console.log('Admin panel detected new user registration:', event.detail);
        setTimeout(() => {
          loadUsers(); // Refresh user list after a small delay
        }, 500);
        toast({
          title: "New User Registered",
          description: `${event.detail.user.name} (${event.detail.user.email}) just registered!`,
        });
      };

      // Listen for new transactions
      const handleNewTransaction = (event: CustomEvent) => {
        console.log('Admin panel detected new transaction:', event.detail);
        setTimeout(() => {
          loadTransactions();
        }, 500);
        toast({
          title: "New Transaction",
          description: `New ${event.detail.transaction.type} transaction received`,
        });
      };
      
      window.addEventListener('userRegistered', handleUserRegistration as EventListener);
      window.addEventListener('newTransaction', handleNewTransaction as EventListener);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('userRegistered', handleUserRegistration as EventListener);
        window.removeEventListener('newTransaction', handleNewTransaction as EventListener);
      };
    }
  }, [isAuthenticated, toast]);

  const loadUsers = () => {
    console.log('Admin panel loading users...');
    
    // Load from registered users (primary source)
    const registeredUsers = localStorage.getItem('capitalengine_registered_users');
    
    if (registeredUsers) {
      const regUsers = JSON.parse(registeredUsers);
      console.log('Found registered users:', regUsers);
      
      const formattedUsers: User[] = regUsers.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance || 0,
        registrationDate: user.registrationDate || new Date().toISOString(),
        lastLoginDate: user.lastLoginDate,
        loginAttempts: user.loginAttempts || 0
      }));
      
      setUsers(formattedUsers);
      console.log('Admin panel updated with users:', formattedUsers);
    } else {
      console.log('No registered users found');
      setUsers([]);
    }
  };

  const loadTransactions = () => {
    console.log('Admin panel loading transactions...');
    const globalTransactions = localStorage.getItem('capitalengine_all_transactions');
    if (globalTransactions) {
      const allTransactions = JSON.parse(globalTransactions);
      console.log('Found transactions:', allTransactions);
      setTransactions(allTransactions);
    } else {
      console.log('No transactions found');
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
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === transactionId ? { ...transaction, status } : transaction
    );
    
    setTransactions(updatedTransactions);
    localStorage.setItem('capitalengine_all_transactions', JSON.stringify(updatedTransactions));

    // Update user transactions
    const userTransactions = localStorage.getItem('capitalengine_transactions');
    if (userTransactions) {
      const userTxns = JSON.parse(userTransactions);
      const updatedUserTxns = userTxns.map((transaction: Transaction) =>
        transaction.id === transactionId ? { ...transaction, status } : transaction
      );
      localStorage.setItem('capitalengine_transactions', JSON.stringify(updatedUserTxns));
    }

    // If deposit is completed, update user balance
    if (status === 'completed') {
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction && transaction.type === 'deposit' && transaction.userId) {
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
      title: status === 'completed' ? "Transaction Approved" : "Transaction Rejected",
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
    loadUsers();
    loadTransactions();
    toast({
      title: "Refreshed",
      description: "All data has been refreshed from the main website.",
    });
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL user data? This action cannot be undone.')) {
      // Clear all localStorage data
      localStorage.removeItem('capitalengine_registered_users');
      localStorage.removeItem('capitalengine_passwords');
      localStorage.removeItem('capitalengine_user');
      localStorage.removeItem('capitalengine_balance');
      localStorage.removeItem('capitalengine_transactions');
      localStorage.removeItem('capitalengine_all_transactions');
      localStorage.removeItem('capitalengine_login_attempts');
      
      // Clear state
      setUsers([]);
      setTransactions([]);
      setSelectedUser('');
      setBalanceAmount('');
      
      toast({
        title: "All Data Cleared",
        description: "All user data has been deleted. You can now test fresh registrations.",
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
              Real-time user management & deposit approval
            </p>
            <p className="text-slate-300 text-sm mt-1">
              Total Users: {users.length} | Pending Deposits: {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length} | Live sync every 2 seconds
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={clearAllData}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              Clear All Data
            </Button>
            <Button 
              onClick={refreshData}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Refresh Data
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
              User Management
            </Button>
            <Button
              onClick={() => setActiveTab('deposits')}
              variant={activeTab === 'deposits' ? 'default' : 'outline'}
              className={activeTab === 'deposits' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
            >
              Deposit Approval ({transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length})
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
                  <CardTitle className="text-white">System Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">Total Registered Users</span>
                      <span className="text-white font-bold">{users.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">Total Balance Pool</span>
                      <span className="text-emerald-400 font-bold">
                        {formatAmount(users.reduce((sum, user) => sum + user.balance, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">Pending Deposits</span>
                      <span className="text-yellow-400 font-bold">
                        {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">Total Transactions</span>
                      <span className="text-purple-400 font-bold">
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
                  All Registered Users - Live Data from Website
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <p>No users registered yet.</p>
                    <p className="text-sm mt-2">Users will appear here automatically when they register on the website.</p>
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
                          <TableCell className="text-white">{user.name}</TableCell>
                          <TableCell className="text-slate-300">{user.email}</TableCell>
                          <TableCell className="text-emerald-400 font-medium">
                            {formatAmount(user.balance)}
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
                              Edit Balance
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
                Deposit Approval - Pending Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.filter(t => t.type === 'deposit').length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <p>No deposit transactions found.</p>
                  <p className="text-sm mt-2">Deposits will appear here when users make them.</p>
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
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => approveTransaction(transaction.id, 'failed')}
                                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                                >
                                  Reject
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

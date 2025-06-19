import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
      
      // Set up interval to refresh user data every 3 seconds for real-time sync
      const interval = setInterval(loadUsers, 3000);
      
      // Listen for new user registrations from the main website
      const handleUserRegistration = (event: CustomEvent) => {
        console.log('Admin panel detected new user registration:', event.detail);
        loadUsers(); // Immediately refresh user list
        toast({
          title: "New User Registered",
          description: `${event.detail.user.name} (${event.detail.user.email}) just registered!`,
        });
      };
      
      window.addEventListener('userRegistered', handleUserRegistration as EventListener);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('userRegistered', handleUserRegistration as EventListener);
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
      
      // Keep admin storage in sync
      localStorage.setItem('capitalengine_admin_users', JSON.stringify(formattedUsers));
      console.log('Admin panel updated with users:', formattedUsers);
    } else {
      console.log('No registered users found, checking admin storage...');
      // Fallback to admin users if no registered users found
      const adminUsers = localStorage.getItem('capitalengine_admin_users');
      if (adminUsers) {
        const adminUsersList = JSON.parse(adminUsers);
        setUsers(adminUsersList);
        console.log('Loaded from admin storage:', adminUsersList);
      } else {
        setUsers([]);
        console.log('No users found in any storage');
      }
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
      localStorage.setItem('capitalengine_admin_users', JSON.stringify(updatedUsers));

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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const refreshUserData = () => {
    loadUsers();
    toast({
      title: "Refreshed",
      description: "User data has been refreshed from the main website.",
    });
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
              Real-time user management - Auto-syncs with website registrations
            </p>
            <p className="text-slate-300 text-sm mt-1">
              Total Users: {users.length} | Live sync active - checking every 3 seconds
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={refreshUserData}
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
                  <span className="text-slate-300">Average Balance</span>
                  <span className="text-blue-400 font-bold">
                    {formatAmount(users.reduce((sum, user) => sum + user.balance, 0) / users.length || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-300">Active Users (Recent Login)</span>
                  <span className="text-purple-400 font-bold">
                    {users.filter(user => user.lastLoginDate && 
                      new Date(user.lastLoginDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
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
                <p className="text-xs mt-1 text-slate-500">Live sync active - checking every 3 seconds</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">
                  🟢 Live sync active - New registrations appear automatically
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-300">Name</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Balance</TableHead>
                      <TableHead className="text-slate-300">Registration Date</TableHead>
                      <TableHead className="text-slate-300">Last Login</TableHead>
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
                        <TableCell className="text-slate-400">
                          {user.lastLoginDate 
                            ? new Date(user.lastLoginDate).toLocaleDateString()
                            : 'Never'
                          }
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;

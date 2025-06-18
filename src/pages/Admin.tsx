
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load users from localStorage (in a real app, this would be from an API)
    const savedUsers = localStorage.getItem('capitalengine_admin_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with some demo users
      const demoUsers: User[] = [
        { id: '1', email: 'user1@example.com', name: 'John Doe', balance: 1500.00 },
        { id: '2', email: 'user2@example.com', name: 'Jane Smith', balance: 2750.50 },
        { id: '3', email: 'user3@example.com', name: 'Mike Johnson', balance: 890.25 },
      ];
      setUsers(demoUsers);
      localStorage.setItem('capitalengine_admin_users', JSON.stringify(demoUsers));
    }
  }, []);

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
      const updatedUsers = users.map(user => 
        user.id === selectedUser 
          ? { ...user, balance: amount }
          : user
      );

      setUsers(updatedUsers);
      localStorage.setItem('capitalengine_admin_users', JSON.stringify(updatedUsers));

      // Also update the user's balance in their local storage
      const userKey = `capitalengine_balance_${selectedUser}`;
      localStorage.setItem(userKey, amount.toString());

      toast({
        title: "Success",
        description: "User balance updated successfully.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            CapitalEngine Admin Panel
          </h1>
          <p className="text-slate-400">
            Manage user accounts and balances
          </p>
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
                        {user.name} ({user.email})
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
                  <span className="text-slate-300">Total Users</span>
                  <span className="text-white font-bold">{users.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-300">Total Balance</span>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="text-white">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Balance</TableHead>
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
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user.id)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;

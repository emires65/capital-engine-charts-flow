
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  registrationDate: string;
  lastLoginDate?: string;
  loginAttempts?: number;
}

interface BalanceUpdateFormProps {
  users: User[];
  onUpdateBalance: (userId: string, amount: number) => Promise<void>;
}

const BalanceUpdateForm = ({ users, onUpdateBalance }: BalanceUpdateFormProps) => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !balanceAmount) {
      return;
    }

    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount < 0) {
      return;
    }

    setLoading(true);
    try {
      await onUpdateBalance(selectedUser, amount);
      setSelectedUser('');
      setBalanceAmount('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Update User Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};

export default BalanceUpdateForm;

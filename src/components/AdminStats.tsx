
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface AdminStatsProps {
  users: User[];
  transactions: Transaction[];
}

const AdminStats = ({ users, transactions }: AdminStatsProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
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
  );
};

export default AdminStats;

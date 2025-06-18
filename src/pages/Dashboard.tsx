
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import Header from '../components/Header';
import RealCryptoChart from '../components/RealCryptoChart';
import TransactionHistory from '../components/TransactionHistory';
import CustomerSupport from '../components/CustomerSupport';
import JivoChat from '../components/JivoChat';

const Dashboard = () => {
  const { user } = useAuth();
  const { balance, transactions } = useTransactions();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const completedDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'completed');
  const totalDeposits = completedDeposits.reduce((sum, t) => sum + t.amount, 0);
  const totalReturns = balance - totalDeposits;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header />
      <JivoChat />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-400">
            Monitor your investments and market trends
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 text-sm font-medium">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatAmount(balance)}</div>
              <div className="text-emerald-400 text-sm">Available Balance</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-400 text-sm font-medium">Total Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatAmount(totalDeposits)}</div>
              <div className="text-slate-400 text-sm">{completedDeposits.length} deposits</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 text-sm font-medium">Total Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatAmount(Math.max(0, totalReturns))}
              </div>
              <div className={`text-sm ${totalReturns >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {totalReturns >= 0 ? 'Profit' : 'Loss'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2">
            <RealCryptoChart />
          </div>
          
          {/* Quick Actions */}
          <div>
            <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your investments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/investment">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Make New Investment
                  </Button>
                </Link>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                  View Transaction History
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                  Download Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transaction History and Support */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <TransactionHistory />
          <CustomerSupport />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

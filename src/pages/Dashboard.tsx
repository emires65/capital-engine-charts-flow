
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import CryptoChart from '../components/CryptoChart';
import JivoChat from '../components/JivoChat';

const Dashboard = () => {
  const { user } = useAuth();

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
              <div className="text-2xl font-bold text-white">$12,485.67</div>
              <div className="text-emerald-400 text-sm">+5.23% (+$620.15)</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-400 text-sm font-medium">Total Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+18.45%</div>
              <div className="text-emerald-400 text-sm">+$1,947.23</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 text-sm font-medium">Active Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-slate-400 text-sm">Bitcoin positions</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Investment Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <CryptoChart />
          </div>
          
          <div className="space-y-6">
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

            <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <div>
                      <div className="text-white text-sm">Bitcoin Investment</div>
                      <div className="text-slate-400 text-xs">2 hours ago</div>
                    </div>
                    <div className="text-emerald-400 text-sm">+$2,450.00</div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <div>
                      <div className="text-white text-sm">Profit Withdrawal</div>
                      <div className="text-slate-400 text-xs">1 day ago</div>
                    </div>
                    <div className="text-blue-400 text-sm">$1,200.00</div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <div className="text-white text-sm">Bitcoin Investment</div>
                      <div className="text-slate-400 text-xs">3 days ago</div>
                    </div>
                    <div className="text-emerald-400 text-sm">+$3,100.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

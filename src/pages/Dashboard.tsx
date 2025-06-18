
import Header from '../components/Header';
import TransactionHistory from '../components/TransactionHistory';
import WithdrawalForm from '../components/WithdrawalForm';
import RealCryptoChart from '../components/RealCryptoChart';
import CustomerSupport from '../components/CustomerSupport';
import JivoChat from '../components/JivoChat';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header />
      <JivoChat />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to CapitalEngine
          </h1>
          <p className="text-slate-400">
            Your Bitcoin Investment Dashboard
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RealCryptoChart />
            <TransactionHistory />
          </div>
          
          <div className="space-y-6">
            <WithdrawalForm />
            <CustomerSupport />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

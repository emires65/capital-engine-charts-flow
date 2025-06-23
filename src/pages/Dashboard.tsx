
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import UserSummaryCard from '@/components/UserSummaryCard';
import CryptoChartWidget from '@/components/CryptoChartWidget';
import TransactionHistory from '@/components/TransactionHistory';

const Dashboard = () => {
  const userSummaryData = {
    balance: 12450.67,
    lastDeposit: 2500.00,
    plan: 'Premium Pro',
    profitToday: 145.32
  };

  const mockTransactions = [
    {
      id: '1',
      type: 'deposit' as const,
      amount: 2500,
      status: 'completed' as const,
      date: '2024-01-15',
      coin: 'BTC'
    },
    {
      id: '2',
      type: 'withdrawal' as const,
      amount: 500,
      status: 'pending' as const,
      date: '2024-01-14',
      coin: 'ETH'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UserSummaryCard {...userSummaryData} />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <CryptoChartWidget />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-800 capitalize">{transaction.type}</p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                    </p>
                    <p className={`text-sm capitalize ${
                      transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

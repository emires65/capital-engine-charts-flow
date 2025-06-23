
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import UserSummaryCard from '@/components/UserSummaryCard';
import CryptoChartWidget from '@/components/CryptoChartWidget';
import RealCryptoChart from '@/components/RealCryptoChart';

const Investment = () => {
  // Mock data - in real app, this would come from your backend
  const userSummaryData = {
    balance: 12450.67,
    lastDeposit: 2500.00,
    plan: 'Premium Pro',
    profitToday: 145.32
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* User Summary Cards */}
        <UserSummaryCard {...userSummaryData} />
        
        {/* Portfolio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">BTC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Bitcoin</p>
                    <p className="text-sm text-gray-600">0.25 BTC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">$12,450.67</p>
                  <p className="text-sm text-green-600">+5.2%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ETH</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Ethereum</p>
                    <p className="text-sm text-gray-600">2.5 ETH</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">$4,850.00</p>
                  <p className="text-sm text-red-600">-2.1%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all">
                <div className="text-center">
                  <p className="text-sm font-medium">Deposit</p>
                  <p className="text-lg font-bold">Funds</p>
                </div>
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
                <div className="text-center">
                  <p className="text-sm font-medium">Withdraw</p>
                  <p className="text-lg font-bold">Profits</p>
                </div>
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all">
                <div className="text-center">
                  <p className="text-sm font-medium">Trade</p>
                  <p className="text-lg font-bold">Crypto</p>
                </div>
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all">
                <div className="text-center">
                  <p className="text-sm font-medium">View</p>
                  <p className="text-lg font-bold">History</p>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Crypto Chart Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CryptoChartWidget />
          <RealCryptoChart />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Investment;

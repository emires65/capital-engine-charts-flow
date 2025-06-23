
import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

interface UserSummaryCardProps {
  balance: number;
  lastDeposit: number;
  plan: string;
  profitToday: number;
}

const UserSummaryCard = ({ balance, lastDeposit, plan, profitToday }: UserSummaryCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Balance */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Balance</p>
            <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
          </div>
          <DollarSign className="w-8 h-8 text-blue-200" />
        </div>
        <div className="mt-4 flex items-center">
          <ArrowUpRight className="w-4 h-4 text-green-300 mr-1" />
          <span className="text-sm text-green-300">+12.5% from last month</span>
        </div>
      </div>

      {/* Last Deposit */}
      <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Last Deposit</p>
            <p className="text-2xl font-bold">${lastDeposit.toLocaleString()}</p>
          </div>
          <ArrowDownRight className="w-8 h-8 text-green-200" />
        </div>
        <div className="mt-4">
          <span className="text-sm text-green-300">2 days ago</span>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Current Plan</p>
            <p className="text-xl font-bold">{plan}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-200" />
        </div>
        <div className="mt-4">
          <span className="text-sm text-purple-300">15% APY</span>
        </div>
      </div>

      {/* Today's Profit */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Today's Profit</p>
            <p className="text-2xl font-bold">${profitToday.toLocaleString()}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-200" />
        </div>
        <div className="mt-4 flex items-center">
          <ArrowUpRight className="w-4 h-4 text-green-300 mr-1" />
          <span className="text-sm text-green-300">+8.2% today</span>
        </div>
      </div>
    </div>
  );
};

export default UserSummaryCard;

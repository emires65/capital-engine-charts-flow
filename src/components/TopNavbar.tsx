
import React from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TopNavbar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 ml-64">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">Welcome back!</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Balance Summary */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg">
            <div className="text-sm font-medium">Balance</div>
            <div className="text-lg font-bold">$12,450.67</div>
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-800">{user?.email || 'User'}</div>
              <div className="text-gray-500">Premium</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;

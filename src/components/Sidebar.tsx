
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PieChart, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  History, 
  Settings,
  TrendingUp,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: PieChart, label: 'Portfolio', path: '/investment' },
    { icon: ArrowDownCircle, label: 'Deposit', path: '/deposit' },
    { icon: ArrowUpCircle, label: 'Withdraw', path: '/withdraw' },
    { icon: History, label: 'Transactions', path: '/transactions' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4 fixed left-0 top-0 z-40">
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold">CapitalEngine</h1>
        </div>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <Link
          to="/admin"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Shield className="w-5 h-5" />
          <span>Admin Panel</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

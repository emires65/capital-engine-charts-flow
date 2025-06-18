
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, LayoutDashboard, Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Investment', path: '/investment', icon: Wallet },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="md:hidden">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-slate-900 border-slate-700">
          <div className="flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)}
                className="text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-medium">{item.label}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-slate-700">
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors mb-2"
                >
                  <Wallet className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">Deposit</span>
                </Link>
                
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors mb-2"
                >
                  <Wallet className="h-5 w-5 text-red-400" />
                  <span className="text-white font-medium">Withdraw</span>
                </Link>
                
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors mb-4"
                >
                  <span className="text-blue-400 text-sm">💬</span>
                  <span className="text-white font-medium">Customer Support</span>
                </Link>
                
                <Button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 p-3 bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </nav>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileNavigation;

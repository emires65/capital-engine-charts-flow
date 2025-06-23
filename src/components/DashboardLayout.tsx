
import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import PriceTicker from './PriceTicker';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PriceTicker />
      <Sidebar />
      <div className="ml-64">
        <TopNavbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

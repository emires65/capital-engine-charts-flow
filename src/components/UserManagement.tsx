
import AdminStats from './AdminStats';
import BalanceUpdateForm from './BalanceUpdateForm';
import UsersTable from './UsersTable';

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  registrationDate: string;
  lastLoginDate?: string;
  loginAttempts?: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  btcAmount?: number;
  txHash?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

interface UserManagementProps {
  users: User[];
  transactions: Transaction[];
  onUpdateBalance: (userId: string, amount: number) => Promise<void>;
  onSelectUserForFunding: (userId: string, currentBalance: number) => void;
}

const UserManagement = ({ 
  users, 
  transactions, 
  onUpdateBalance, 
  onSelectUserForFunding 
}: UserManagementProps) => {
  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8">
        <BalanceUpdateForm users={users} onUpdateBalance={onUpdateBalance} />
        <AdminStats users={users} transactions={transactions} />
      </div>
      <UsersTable users={users} onSelectUserForFunding={onSelectUserForFunding} />
    </>
  );
};

export default UserManagement;

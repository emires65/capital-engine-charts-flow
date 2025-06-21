
import DepositsTable from './DepositsTable';

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

interface DepositApprovalProps {
  transactions: Transaction[];
  onApproveTransaction: (transactionId: string, status: 'completed' | 'failed') => void;
}

const DepositApproval = ({ transactions, onApproveTransaction }: DepositApprovalProps) => {
  return (
    <DepositsTable 
      transactions={transactions} 
      onApproveTransaction={onApproveTransaction} 
    />
  );
};

export default DepositApproval;

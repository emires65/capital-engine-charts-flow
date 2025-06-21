
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

interface DepositsTableProps {
  transactions: Transaction[];
  onApproveTransaction: (transactionId: string, status: 'completed' | 'failed') => void;
}

const DepositsTable = ({ transactions, onApproveTransaction }: DepositsTableProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const depositTransactions = transactions.filter(t => t.type === 'deposit');

  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">
          💰 Deposit Approval - Live Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {depositTransactions.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <div className="text-6xl mb-4">💳</div>
            <p className="text-xl mb-2">No deposit transactions found.</p>
            <p className="text-sm">Deposits will appear here when users make them.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-300">User</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Amount</TableHead>
                <TableHead className="text-slate-300">BTC Amount</TableHead>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depositTransactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-white">{transaction.userName || 'Unknown'}</TableCell>
                    <TableCell className="text-slate-300">{transaction.userEmail || 'Unknown'}</TableCell>
                    <TableCell className="text-emerald-400 font-medium">
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-orange-400">
                      {transaction.btcAmount ? `${transaction.btcAmount.toFixed(8)} BTC` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.status === 'completed' ? 'default' : 
                          transaction.status === 'failed' ? 'destructive' : 
                          'secondary'
                        }
                        className={
                          transaction.status === 'completed' ? 'bg-green-600' :
                          transaction.status === 'failed' ? 'bg-red-600' :
                          'bg-yellow-600'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onApproveTransaction(transaction.id, 'completed')}
                            className="border-green-600 text-green-400 hover:bg-green-900/20"
                          >
                            ✅ Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onApproveTransaction(transaction.id, 'failed')}
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            ❌ Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DepositsTable;

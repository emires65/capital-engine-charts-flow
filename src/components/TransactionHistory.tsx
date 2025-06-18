
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '../contexts/TransactionContext';

const TransactionHistory = () => {
  const { transactions, balance } = useTransactions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Account Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-400">
            {formatAmount(balance)}
          </div>
          <p className="text-slate-400 text-sm mt-1">Available Balance</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${transaction.type === 'deposit' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                    <div>
                      <div className="text-white font-medium capitalize">
                        {transaction.type}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {formatDate(transaction.date)}
                      </div>
                      {transaction.btcAmount && (
                        <div className="text-yellow-400 text-xs">
                          ₿ {transaction.btcAmount.toFixed(8)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${transaction.type === 'deposit' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </div>
                    <Badge className={`${getStatusColor(transaction.status)} text-white text-xs`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;

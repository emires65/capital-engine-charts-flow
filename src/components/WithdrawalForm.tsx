
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../hooks/use-toast';
import { useTransactions } from '../contexts/TransactionContext';

const WithdrawalForm = () => {
  const [amount, setAmount] = useState('');
  const [btcAddress, setBtcAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addTransaction, balance } = useTransactions();

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawalAmount = parseFloat(amount);
    
    if (!amount || withdrawalAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    if (withdrawalAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds available balance.",
        variant: "destructive",
      });
      return;
    }

    if (!btcAddress) {
      toast({
        title: "Bitcoin Address Required",
        description: "Please enter your Bitcoin withdrawal address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const btcAmount = withdrawalAmount / 45000; // Approximate BTC price

      addTransaction({
        type: 'withdrawal',
        amount: withdrawalAmount,
        status: 'pending',
        btcAmount: btcAmount,
        txHash: `withdrawal_${Date.now()}`
      });

      toast({
        title: "Withdrawal Initiated",
        description: `Your withdrawal of $${amount} has been initiated. Processing may take 24-48 hours.`,
      });
      
      setLoading(false);
      setAmount('');
      setBtcAddress('');
    }, 2000);
  };

  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Withdraw Funds</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleWithdrawal} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Withdrawal Amount (USD)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              min="50"
              step="0.01"
              required
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
            <p className="text-xs text-slate-400 mt-1">
              Available Balance: ${balance.toLocaleString()}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Bitcoin Address
            </label>
            <Input
              type="text"
              value={btcAddress}
              onChange={(e) => setBtcAddress(e.target.value)}
              placeholder="Enter your Bitcoin address"
              required
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
            <p className="text-xs text-slate-400 mt-1">
              Enter the Bitcoin address where you want to receive your funds
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Processing Withdrawal...' : 'Request Withdrawal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WithdrawalForm;

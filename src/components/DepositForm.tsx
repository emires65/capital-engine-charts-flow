
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/contexts/TransactionContext';
import { supabase } from '@/integrations/supabase/client';
import PlanSelection from './PlanSelection';

interface InvestmentPlan {
  id: string;
  name: string;
  minimum_deposit: number;
  daily_profit_percentage: number;
  duration_days: number;
  description: string;
}

const DepositForm = () => {
  const [amount, setAmount] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'plan' | 'deposit'>('plan');
  const { toast } = useToast();
  const { addTransaction } = useTransactions();

  useEffect(() => {
    if (selectedPlanId) {
      fetchPlanDetails();
    }
  }, [selectedPlanId]);

  const fetchPlanDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('id', selectedPlanId)
        .single();

      if (error) throw error;
      setSelectedPlan(data);
    } catch (error) {
      console.error('Error fetching plan details:', error);
    }
  };

  const handlePlanSelected = (planId: string) => {
    setSelectedPlanId(planId);
    setStep('deposit');
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const depositAmount = parseFloat(amount);
    
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select an investment plan first.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    if (depositAmount < selectedPlan.minimum_deposit) {
      toast({
        title: "Minimum Deposit Required",
        description: `The minimum deposit for ${selectedPlan.name} is $${selectedPlan.minimum_deposit.toLocaleString()}.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make a deposit.",
          variant: "destructive",
        });
        return;
      }

      // Create transaction record in Supabase
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            type: 'deposit',
            amount: depositAmount,
            plan_id: selectedPlanId,
            status: 'pending',
            payment_method: 'Bitcoin',
            coin_type: 'BTC'
          }
        ])
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Also update the plan for the user
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ plan_id: selectedPlanId })
        .eq('id', user.id);

      if (userUpdateError) throw userUpdateError;

      // Add to local transaction context for immediate UI update
      addTransaction({
        type: 'deposit',
        amount: depositAmount,
        status: 'pending',
        btcAmount: depositAmount / 45000, // Approximate BTC price
        txHash: `deposit_${Date.now()}`
      });

      toast({
        title: "Deposit Initiated",
        description: `Your deposit of $${amount} to ${selectedPlan.name} has been initiated. Please complete the Bitcoin payment.`,
      });
      
      setAmount('');
      setStep('plan');
      setSelectedPlanId('');
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error creating deposit:', error);
      toast({
        title: "Deposit Failed",
        description: "Failed to initiate deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'plan') {
    return (
      <div className="space-y-6">
        <PlanSelection 
          onPlanSelected={handlePlanSelected}
          selectedPlanId={selectedPlanId}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        onClick={() => setStep('plan')} 
        variant="outline"
        className="mb-4"
      >
        ← Back to Plan Selection
      </Button>

      {selectedPlan && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Selected Plan: {selectedPlan.name}</span>
              <Badge className="bg-blue-600 text-white">
                {selectedPlan.daily_profit_percentage}% Daily
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Min. Deposit:</span>
                <div className="font-semibold">${selectedPlan.minimum_deposit.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <div className="font-semibold">{selectedPlan.duration_days} days</div>
              </div>
              <div>
                <span className="text-gray-600">Daily Return:</span>
                <div className="font-semibold text-green-600">{selectedPlan.daily_profit_percentage}%</div>
              </div>
              <div>
                <span className="text-gray-600">Total ROI:</span>
                <div className="font-semibold text-green-600">
                  {(selectedPlan.daily_profit_percentage * selectedPlan.duration_days).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Make a Deposit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">
                Deposit Amount (USD)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Minimum: $${selectedPlan?.minimum_deposit.toLocaleString()}`}
                min={selectedPlan?.minimum_deposit}
                step="0.01"
                required
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
              {selectedPlan && (
                <p className="text-xs text-slate-400 mt-1">
                  Expected daily profit: ${amount ? ((parseFloat(amount) * selectedPlan.daily_profit_percentage) / 100).toFixed(2) : '0.00'}
                </p>
              )}
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Bitcoin Payment Address</h4>
              <div className="bg-slate-800 p-3 rounded border border-slate-600">
                <code className="text-green-400 text-sm break-all">
                  bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                </code>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Send the exact Bitcoin equivalent to this address. Your deposit will be processed within 1-3 confirmations.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Processing Deposit...' : 'Confirm Deposit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositForm;

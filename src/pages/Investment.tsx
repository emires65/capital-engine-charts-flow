
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../hooks/use-toast';
import { useTransactions } from '../contexts/TransactionContext';
import Header from '../components/Header';
import RealCryptoChart from '../components/RealCryptoChart';
import JivoChat from '../components/JivoChat';

const Investment = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addTransaction } = useTransactions();

  const BTC_WALLET_ADDRESS = 'bc1qgrvdcf03vgfkymdxaw52mkmkqej2g3phfjsmdv';

  const handleInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid investment amount.",
        variant: "destructive",
      });
      return;
    }

    const investmentAmount = parseFloat(amount);
    
    if (investmentAmount < 100) {
      toast({
        title: "Minimum Investment",
        description: "Minimum investment amount is $100.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate processing and add transaction
    setTimeout(() => {
      // Calculate approximate BTC amount (this would be real-time in production)
      const btcAmount = investmentAmount / 45000; // Approximate BTC price

      addTransaction({
        type: 'deposit',
        amount: investmentAmount,
        status: 'pending',
        btcAmount: btcAmount,
        txHash: `pending_${Date.now()}`
      });

      toast({
        title: "Investment Initiated",
        description: `Your investment of $${amount} has been initiated. Please send Bitcoin to the provided address.`,
      });
      
      setLoading(false);
      setAmount('');
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Bitcoin address copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header />
      <JivoChat />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bitcoin Investment
          </h1>
          <p className="text-slate-400">
            Invest in Bitcoin and grow your portfolio with CapitalEngine
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Investment Form */}
          <div className="space-y-6">
            <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Make Investment</CardTitle>
                <CardDescription className="text-slate-400">
                  Enter your investment amount and send Bitcoin to our address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInvestment} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">
                      Investment Amount (USD)
                    </label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount in USD"
                      min="100"
                      step="0.01"
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Minimum investment: $100
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Initiate Investment'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <span className="text-2xl mr-2">₿</span>
                  Bitcoin Payment Address
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Send your Bitcoin payment to this address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                    <div className="text-yellow-400 text-xs font-mono break-all">
                      {BTC_WALLET_ADDRESS}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => copyToClipboard(BTC_WALLET_ADDRESS)}
                    variant="outline" 
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Copy Address
                  </Button>

                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <h4 className="text-blue-400 font-medium mb-2">Payment Instructions:</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Send Bitcoin to the address above</li>
                      <li>• Include your investment amount in USD as reference</li>
                      <li>• Minimum investment: $100</li>
                      <li>• Processing time: 1-6 confirmations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Investment Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border border-slate-600 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-blue-400 font-medium">Starter Plan</div>
                        <div className="text-slate-400 text-sm">$100 - $999</div>
                      </div>
                      <div className="text-emerald-400 font-bold">12% Monthly</div>
                    </div>
                  </div>
                  
                  <div className="border border-slate-600 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-purple-400 font-medium">Professional</div>
                        <div className="text-slate-400 text-sm">$1,000 - $9,999</div>
                      </div>
                      <div className="text-emerald-400 font-bold">18% Monthly</div>
                    </div>
                  </div>
                  
                  <div className="border border-slate-600 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-yellow-400 font-medium">Elite</div>
                        <div className="text-slate-400 text-sm">$10,000+</div>
                      </div>
                      <div className="text-emerald-400 font-bold">25% Monthly</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <div>
            <RealCryptoChart />
            
            <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-white">Why Invest with CapitalEngine?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-slate-300">
                  <div className="flex items-start space-x-3">
                    <div className="text-emerald-400 mt-1">✓</div>
                    <div>
                      <div className="font-medium">Professional Trading</div>
                      <div className="text-sm text-slate-400">Expert algorithms and market analysis</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-emerald-400 mt-1">✓</div>
                    <div>
                      <div className="font-medium">Secure Storage</div>
                      <div className="text-sm text-slate-400">Multi-signature wallets and cold storage</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-emerald-400 mt-1">✓</div>
                    <div>
                      <div className="font-medium">Transparent Returns</div>
                      <div className="text-sm text-slate-400">Real-time tracking and reporting</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-emerald-400 mt-1">✓</div>
                    <div>
                      <div className="font-medium">24/7 Support</div>
                      <div className="text-sm text-slate-400">Live chat support and assistance</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investment;

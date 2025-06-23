
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfit {
  id: string;
  daily_profit: number;
  profit_date: string;
  is_paid: boolean;
  plan_id: string;
  investment_plans: {
    name: string;
    daily_profit_percentage: number;
  };
}

const ProfitsDisplay = () => {
  const [profits, setProfits] = useState<UserProfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProfits, setTotalProfits] = useState(0);
  const [todayProfits, setTodayProfits] = useState(0);

  useEffect(() => {
    fetchProfits();
  }, []);

  const fetchProfits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profits')
        .select(`
          *,
          investment_plans (
            name,
            daily_profit_percentage
          )
        `)
        .eq('user_id', user.id)
        .order('profit_date', { ascending: false });

      if (error) throw error;

      setProfits(data || []);
      
      // Calculate totals
      const total = (data || []).reduce((sum, profit) => sum + Number(profit.daily_profit), 0);
      setTotalProfits(total);

      const today = new Date().toISOString().split('T')[0];
      const todayTotal = (data || [])
        .filter(profit => profit.profit_date === today)
        .reduce((sum, profit) => sum + Number(profit.daily_profit), 0);
      setTodayProfits(todayTotal);
    } catch (error) {
      console.error('Error fetching profits:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-20 bg-gray-200 rounded-t-lg"></CardHeader>
              <CardContent className="h-16 bg-gray-100"></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profit Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profits</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProfits)}</div>
            <p className="text-xs text-green-100">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Profit</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(todayProfits)}</div>
            <p className="text-xs text-blue-100">
              Today's earnings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Profits</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profits.length}</div>
            <p className="text-xs text-purple-100">
              Total profit entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profits History */}
      <Card>
        <CardHeader>
          <CardTitle>Profit History</CardTitle>
        </CardHeader>
        <CardContent>
          {profits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No profits yet. Complete a deposit to start earning!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profits.map((profit) => (
                <div key={profit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Daily Profit - {profit.investment_plans?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(profit.profit_date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      +{formatCurrency(Number(profit.daily_profit))}
                    </div>
                    <Badge className={profit.is_paid ? 'bg-green-600' : 'bg-yellow-600'}>
                      {profit.is_paid ? 'Paid' : 'Pending'}
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

export default ProfitsDisplay;

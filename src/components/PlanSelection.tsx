
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Diamond } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InvestmentPlan {
  id: string;
  name: string;
  minimum_deposit: number;
  daily_profit_percentage: number;
  duration_days: number;
  description: string;
  is_active: boolean;
}

interface PlanSelectionProps {
  onPlanSelected: (planId: string) => void;
  selectedPlanId?: string;
}

const PlanSelection = ({ onPlanSelected, selectedPlanId }: PlanSelectionProps) => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('is_active', true)
        .order('minimum_deposit', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to load investment plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic plan':
        return <Star className="w-6 h-6" />;
      case 'premium plan':
        return <Crown className="w-6 h-6" />;
      case 'premium pro':
        return <Diamond className="w-6 h-6" />;
      case 'vip plan':
        return <Crown className="w-6 h-6 text-yellow-500" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic plan':
        return 'from-blue-500 to-blue-600';
      case 'premium plan':
        return 'from-purple-500 to-purple-600';
      case 'premium pro':
        return 'from-orange-500 to-orange-600';
      case 'vip plan':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-gray-200 rounded-t-lg"></CardHeader>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Investment Plan</h2>
        <p className="text-gray-600">Select the plan that best fits your investment goals</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              selectedPlanId === plan.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
          >
            <CardHeader className={`bg-gradient-to-r ${getPlanColor(plan.name)} text-white p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getPlanIcon(plan.name)}
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                </div>
                {selectedPlanId === plan.id && (
                  <Badge className="bg-white text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    Selected
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold">{plan.daily_profit_percentage}%</div>
                <div className="text-sm opacity-90">Daily Returns</div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Minimum Deposit</span>
                    <span className="font-semibold">${plan.minimum_deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-semibold">{plan.duration_days} days</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Total ROI</span>
                    <span className="font-semibold text-green-600">
                      {(plan.daily_profit_percentage * plan.duration_days).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                
                <Button
                  onClick={() => onPlanSelected(plan.id)}
                  className={`w-full ${
                    selectedPlanId === plan.id 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {selectedPlanId === plan.id ? 'Selected' : 'Select Plan'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanSelection;

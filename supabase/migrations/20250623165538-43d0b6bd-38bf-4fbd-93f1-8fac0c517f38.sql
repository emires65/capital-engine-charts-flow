
-- Create investment_plans table
CREATE TABLE IF NOT EXISTS investment_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  minimum_deposit DECIMAL(20, 8) NOT NULL,
  daily_profit_percentage DECIMAL(5, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default investment plans
INSERT INTO investment_plans (name, minimum_deposit, daily_profit_percentage, duration_days, description) VALUES
('Basic Plan', 100.00, 1.5, 30, 'Perfect for beginners with 1.5% daily returns for 30 days'),
('Premium Plan', 1000.00, 2.5, 45, 'Enhanced returns with 2.5% daily profit for 45 days'),
('Premium Pro', 5000.00, 3.5, 60, 'Maximum returns with 3.5% daily profit for 60 days'),
('VIP Plan', 10000.00, 5.0, 90, 'Exclusive VIP plan with 5% daily returns for 90 days');

-- Add plan_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES investment_plans(id);

-- Update transactions table to include profit calculations
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS profit_amount DECIMAL(20, 8) DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES investment_plans(id);

-- Create user_profits table to track daily profits
CREATE TABLE IF NOT EXISTS user_profits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES investment_plans(id),
  daily_profit DECIMAL(20, 8) NOT NULL,
  profit_date DATE NOT NULL,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profits ENABLE ROW LEVEL SECURITY;

-- Create policies for investment_plans (public read access)
CREATE POLICY "Anyone can view investment plans" ON investment_plans
  FOR SELECT USING (is_active = true);

-- Create policies for user_profits
CREATE POLICY "Users can view own profits" ON user_profits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profits" ON user_profits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update existing policies to ensure user isolation
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to calculate daily profits
CREATE OR REPLACE FUNCTION calculate_daily_profits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert daily profits for completed deposits
  INSERT INTO user_profits (user_id, transaction_id, plan_id, daily_profit, profit_date)
  SELECT 
    t.user_id,
    t.id,
    t.plan_id,
    (t.amount * ip.daily_profit_percentage / 100) as daily_profit,
    CURRENT_DATE
  FROM transactions t
  JOIN investment_plans ip ON t.plan_id = ip.id
  WHERE t.type = 'deposit' 
    AND t.status = 'completed'
    AND t.created_at::date <= CURRENT_DATE - INTERVAL '1 day'
    AND NOT EXISTS (
      SELECT 1 FROM user_profits up 
      WHERE up.transaction_id = t.id 
        AND up.profit_date = CURRENT_DATE
    );
END;
$$;

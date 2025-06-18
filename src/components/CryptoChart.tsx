
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceData {
  time: string;
  price: number;
}

const CryptoChart = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);

  useEffect(() => {
    // Generate initial mock data
    const generateMockData = () => {
      const basePrice = 45000;
      const data: PriceData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const randomVariation = (Math.random() - 0.5) * 2000;
        const price = basePrice + randomVariation + (Math.random() * 10000 - 5000);
        
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: Math.max(price, 30000)
        });
      }
      
      return data;
    };

    const initialData = generateMockData();
    setPriceData(initialData);
    setCurrentPrice(initialData[initialData.length - 1]?.price || 45000);

    // Simulate real-time price updates
    const interval = setInterval(() => {
      setPriceData(prevData => {
        const lastPrice = prevData[prevData.length - 1]?.price || 45000;
        const variation = (Math.random() - 0.5) * 1000;
        const newPrice = Math.max(lastPrice + variation, 30000);
        const now = new Date();
        
        const newData = [...prevData.slice(1), {
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: newPrice
        }];
        
        setCurrentPrice(newPrice);
        setPriceChange(newPrice - lastPrice);
        
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-white text-xl">Bitcoin (BTC)</span>
            <span className="text-2xl">₿</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {formatPrice(currentPrice)}
            </div>
            <div className={`text-sm ${priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{formatPrice(priceChange)} ({((priceChange / currentPrice) * 100).toFixed(2)}%)
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value: any) => [formatPrice(value), 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoChart;


import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    sparkline_7d: {
      price: number[];
    };
  };
}

const CryptoChartWidget = () => {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const coins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'tether', symbol: 'USDT', name: 'Tether' },
    { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin' },
    { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu' },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  ];

  useEffect(() => {
    const fetchCoinData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
        );
        const data = await response.json();
        setCoinData(data);
        
        // Format chart data
        const prices = data.market_data.sparkline_7d.price;
        const formattedData = prices.map((price: number, index: number) => ({
          time: index,
          price: price,
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [selectedCoin]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">Live Crypto Chart</h3>
        <div className="flex flex-wrap gap-2">
          {coins.map((coin) => (
            <button
              key={coin.id}
              onClick={() => setSelectedCoin(coin.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCoin === coin.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {coin.symbol}
            </button>
          ))}
        </div>
      </div>

      {coinData && (
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <img src={coinData.image?.small} alt={coinData.name} className="w-8 h-8" />
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{coinData.name}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${coinData.market_data?.current_price?.usd?.toLocaleString()}
                </span>
                <span className={`text-sm font-medium ${
                  coinData.market_data?.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {coinData.market_data?.price_change_percentage_24h >= 0 ? '+' : ''}
                  {coinData.market_data?.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
              labelFormatter={() => '7 Day Chart'}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CryptoChartWidget;

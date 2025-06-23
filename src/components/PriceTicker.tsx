
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const PriceTicker = () => {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,shiba-inu,dogecoin&order=market_cap_desc&per_page=6&page=1&sparkline=false'
        );
        const data = await response.json();
        setPrices(data);
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-3 overflow-hidden">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-white">Loading live prices...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-3 overflow-hidden relative">
      <div className="animate-scroll flex items-center space-x-8 whitespace-nowrap">
        {prices.concat(prices).map((coin, index) => (
          <div key={`${coin.id}-${index}`} className="flex items-center space-x-2 text-white">
            <img src={coin.image} alt={coin.name} className="w-6 h-6" />
            <span className="font-semibold">{coin.symbol.toUpperCase()}</span>
            <span className="text-lg font-bold">${coin.current_price.toLocaleString()}</span>
            <div className={`flex items-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {coin.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="text-sm">
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTicker;

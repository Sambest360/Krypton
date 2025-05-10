
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

type MarketData = {
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
};

const MarketTrends: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple&order=market_cap_desc&sparkline=false'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        
        const data = await response.json();
        setMarketData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Loading market data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Market Trends</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3">Asset</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">24h Change</th>
                <th className="text-left p-3 hidden sm:table-cell">Volume</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((asset) => (
                <tr key={asset.symbol} className="border-b">
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: '#F7931A' }}
                      >
                        {asset.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium">
                    ${asset.current_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3">
                    <div className={`flex items-center ${asset.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.price_change_percentage_24h >= 0 ? (
                        <TrendingUp size={12} className="mr-1" />
                      ) : (
                        <TrendingDown size={12} className="mr-1" />
                      )}
                      {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground">
                    ${asset.total_volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketTrends;

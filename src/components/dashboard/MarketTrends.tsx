
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Mock market data
const marketData = [
  { name: 'Bitcoin', symbol: 'BTC', price: 50432.67, change: 2.35, volume: '12.5B', color: '#F7931A' },
  { name: 'Ethereum', symbol: 'ETH', price: 2987.41, change: 1.87, volume: '8.2B', color: '#627EEA' },
  { name: 'XRP', symbol: 'XRP', price: 0.512, change: -0.73, volume: '2.1B', color: '#23292F' },
  { name: 'US Dollar', symbol: 'USD', price: 1.00, change: 0.05, volume: '86.3B', color: '#6B8068' },
  { name: 'British Pound', symbol: 'GBP', price: 1.30, change: -0.12, volume: '4.9B', color: '#213A87' },
  { name: 'Euro', symbol: 'EUR', price: 1.18, change: 0.22, volume: '19.7B', color: '#0F47AF' },
];

const MarketTrends = () => {
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
                        style={{ backgroundColor: asset.color }}
                      >
                        {asset.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium">
                    {asset.symbol === 'USD' || asset.symbol === 'GBP' || asset.symbol === 'EUR'
                      ? new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        }).format(asset.price)
                      : `$${asset.price.toLocaleString()}`
                    }
                  </td>
                  <td className="p-3">
                    <div className={`flex items-center ${asset.change >= 0 ? 'text-trading-success' : 'text-trading-danger'}`}>
                      {asset.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span className="ml-1">{asset.change >= 0 ? '+' : ''}{asset.change}%</span>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground">
                    {asset.volume}
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

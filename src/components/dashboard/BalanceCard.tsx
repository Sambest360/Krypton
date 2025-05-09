
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

// Asset icons and colors
const assetConfig = {
  BTC: { name: 'Bitcoin', color: '#F7931A', symbol: '₿' },
  ETH: { name: 'Ethereum', color: '#627EEA', symbol: 'Ξ' },
  XRP: { name: 'XRP', color: '#23292F', symbol: 'XRP' },
  USD: { name: 'US Dollar', color: '#6B8068', symbol: '$' },
  GBP: { name: 'British Pound', color: '#213A87', symbol: '£' },
  EUR: { name: 'Euro', color: '#0F47AF', symbol: '€' },
};

type AssetDisplayProps = {
  type: keyof typeof assetConfig;
  amount: number;
};

const AssetDisplay: React.FC<AssetDisplayProps> = ({ type, amount }) => {
  const assetInfo = assetConfig[type];
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: assetInfo.color }}
        >
          {assetInfo.symbol}
        </div>
        <div>
          <p className="font-medium">{assetInfo.name}</p>
          <p className="text-xs text-muted-foreground">{type}</p>
        </div>
      </div>
      <p className="font-semibold">
        {type === 'BTC' || type === 'ETH' || type === 'XRP' 
          ? amount.toFixed(type === 'XRP' ? 1 : 5) 
          : new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: type 
            }).format(amount)
        }
      </p>
    </div>
  );
};

const BalanceCard: React.FC = () => {
  const { balance } = useAuth();
  
  // Calculate total balance in USD (simplified conversion)
  const conversionRates = {
    BTC: 50000, // 1 BTC = $50,000
    ETH: 3000,  // 1 ETH = $3,000
    XRP: 0.50,  // 1 XRP = $0.50
    USD: 1,
    GBP: 1.30,  // 1 GBP = $1.30
    EUR: 1.18,  // 1 EUR = $1.18
  };
  
  const totalInUSD = Object.entries(balance).reduce((total, [asset, amount]) => {
    const assetKey = asset as keyof typeof conversionRates;
    return total + (amount * conversionRates[assetKey]);
  }, 0);

  // Cryptocurrencies
  const cryptos = ['BTC', 'ETH', 'XRP'] as const;
  
  // Fiat currencies
  const fiats = ['USD', 'GBP', 'EUR'] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Balance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Balance (USD)</h3>
            <p className="text-3xl font-bold">${totalInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Cryptocurrencies</h3>
            <div className="space-y-3">
              {cryptos.map((crypto) => (
                <AssetDisplay key={crypto} type={crypto} amount={balance[crypto]} />
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Fiat Currencies</h3>
            <div className="space-y-3">
              {fiats.map((fiat) => (
                <AssetDisplay key={fiat} type={fiat} amount={balance[fiat]} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;

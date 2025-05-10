
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

// Asset icons and colors
const assetConfig = {
  btc: { name: 'Bitcoin', color: '#F7931A', symbol: '₿' },
  eth: { name: 'Ethereum', color: '#627EEA', symbol: 'Ξ' },
  xrp: { name: 'XRP', color: '#23292F', symbol: 'XRP' },
  usd: { name: 'US Dollar', color: '#6B8068', symbol: '$' },
  gbp: { name: 'British Pound', color: '#213A87', symbol: '£' },
  eur: { name: 'Euro', color: '#0F47AF', symbol: '€' },
} as const;

type AssetDisplayProps = {
  type: keyof typeof assetConfig;
  amount: string;
};

const AssetDisplay: React.FC<AssetDisplayProps> = ({ type, amount }) => {
  const assetInfo = assetConfig[type];
  const numericAmount = parseFloat(amount);
  
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
          <p className="text-xs text-muted-foreground">{type.toUpperCase()}</p>
        </div>
      </div>
      <p className="font-semibold">
        {type === 'btc' || type === 'eth' || type === 'xrp' 
          ? numericAmount.toFixed(type === 'xrp' ? 1 : 5) 
          : new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: type.toUpperCase() 
            }).format(numericAmount)
        }
      </p>
    </div>
  );
};

const BalanceCard: React.FC = () => {
  const { balance } = useAuth();
  
  if (!balance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Balance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Loading balance...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total balance in USD (simplified conversion)
  const conversionRates = {
    btc: 50000, // 1 BTC = $50,000
    eth: 3000,  // 1 ETH = $3,000
    xrp: 0.50,  // 1 XRP = $0.50
    usd: 1,
    gbp: 1.30,  // 1 GBP = $1.30
    eur: 1.18,  // 1 EUR = $1.18
  } as const;
  
  const totalInUSD = (
    parseFloat(balance.usd) +
    parseFloat(balance.eur) * conversionRates.eur +
    parseFloat(balance.gbp) * conversionRates.gbp +
    parseFloat(balance.btc) * conversionRates.btc +
    parseFloat(balance.eth) * conversionRates.eth +
    parseFloat(balance.xrp) * conversionRates.xrp
  );

  // Cryptocurrencies
  const cryptos = ['btc', 'eth', 'xrp'] as const;
  
  // Fiat currencies
  const fiats = ['usd', 'gbp', 'eur'] as const;

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

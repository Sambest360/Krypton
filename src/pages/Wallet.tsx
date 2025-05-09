
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

// Asset configurations
const assetConfig = {
  BTC: { name: 'Bitcoin', color: '#F7931A', symbol: '₿' },
  ETH: { name: 'Ethereum', color: '#627EEA', symbol: 'Ξ' },
  XRP: { name: 'XRP', color: '#23292F', symbol: 'XRP' },
  USD: { name: 'US Dollar', color: '#6B8068', symbol: '$' },
  GBP: { name: 'British Pound', color: '#213A87', symbol: '£' },
  EUR: { name: 'Euro', color: '#0F47AF', symbol: '€' },
};

const Wallet = () => {
  const { balance } = useAuth();
  
  // Mock transaction history
  const transactions = [
    { id: 1, type: 'Deposit', asset: 'USD', amount: 5000, status: 'Completed', date: '2025-05-08' },
    { id: 2, type: 'Buy', asset: 'BTC', amount: 0.25, status: 'Completed', date: '2025-05-07' },
    { id: 3, type: 'Sell', asset: 'ETH', amount: 1.5, status: 'Completed', date: '2025-05-05' },
    { id: 4, type: 'Withdraw', asset: 'USD', amount: 1000, status: 'Pending', date: '2025-05-04' },
    { id: 5, type: 'Deposit', asset: 'EUR', amount: 2000, status: 'Completed', date: '2025-05-02' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <p className="text-muted-foreground">Manage your assets and transactions</p>
      </div>
      
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        {(Object.keys(assetConfig) as Array<keyof typeof assetConfig>).map((asset) => (
          <Card key={asset}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: assetConfig[asset].color }}
                  >
                    {assetConfig[asset].symbol}
                  </div>
                  <CardTitle className="text-base">{assetConfig[asset].name}</CardTitle>
                </div>
                <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
                  {asset}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {asset === 'BTC' || asset === 'ETH' || asset === 'XRP' 
                    ? balance[asset].toFixed(asset === 'XRP' ? 1 : 5) 
                    : new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: asset 
                      }).format(balance[asset])
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  {asset === 'BTC' || asset === 'ETH' || asset === 'XRP' 
                    ? `≈ $${(balance[asset] * (asset === 'BTC' ? 50000 : asset === 'ETH' ? 3000 : 0.50)).toLocaleString()}`
                    : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Wallet;

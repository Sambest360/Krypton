
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
      
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
              <CardDescription>Add money to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="asset">Select Asset</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue placeholder="Select an asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(assetConfig).map((asset) => (
                        <SelectItem key={asset} value={asset}>
                          {assetConfig[asset as keyof typeof assetConfig].name} ({asset})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="0.00"
                      className="pl-8"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select defaultValue="card">
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full bg-trading-primary hover:bg-trading-secondary">
                  Continue to Payment
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Note: This is a demo. No actual transactions will be processed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>Send money to your bank or wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdraw-asset">Select Asset</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger id="withdraw-asset">
                      <SelectValue placeholder="Select an asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(assetConfig).map((asset) => (
                        <SelectItem key={asset} value={asset}>
                          {assetConfig[asset as keyof typeof assetConfig].name} ({asset})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="withdraw-amount">Amount</Label>
                    <span className="text-xs text-muted-foreground">
                      Available: $5,000.00
                    </span>
                  </div>
                  <div className="relative">
                    <Input 
                      id="withdraw-amount" 
                      type="number" 
                      placeholder="0.00"
                      className="pl-8"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="withdraw-destination">Destination</Label>
                  <Select defaultValue="bank">
                    <SelectTrigger id="withdraw-destination">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Account</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="crypto">Crypto Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="w-full">
                  Request Withdrawal
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Note: This is a demo. No actual withdrawals will be processed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">Asset</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b">
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs 
                            ${tx.type === 'Deposit' || tx.type === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-3 font-medium">{tx.asset}</td>
                        <td className="p-3">
                          {tx.asset === 'BTC' || tx.asset === 'ETH' || tx.asset === 'XRP' 
                            ? tx.amount.toFixed(tx.asset === 'XRP' ? 1 : 5) 
                            : new Intl.NumberFormat('en-US', { 
                                style: 'currency', 
                                currency: tx.asset 
                              }).format(tx.amount)
                          }
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs 
                            ${tx.status === 'Completed' ? 'bg-trading-primary/10 text-trading-primary' : 'bg-amber-100 text-amber-800'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Wallet;

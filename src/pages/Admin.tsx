
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useMockData } from '@/contexts/AuthContext';

const Admin = () => {
  const { users, balances } = useMockData();
  
  // Calculate total users
  const totalUsers = users.filter(user => !user.isAdmin).length;
  
  // Calculate KYC verified users
  const verifiedUsers = users.filter(user => user.kycVerified && !user.isAdmin).length;
  
  // Calculate total balance across all assets and users
  const totalBalance = Object.values(balances).reduce((total, userBalance) => {
    const userTotal = (
      userBalance.USD +
      userBalance.EUR * 1.18 +  // Convert to USD
      userBalance.GBP * 1.30 +  // Convert to USD
      userBalance.BTC * 50000 + // Convert to USD
      userBalance.ETH * 3000 +  // Convert to USD
      userBalance.XRP * 0.50    // Convert to USD
    );
    return total + userTotal;
  }, 0);
  
  // Calculate total crypto holdings
  const totalCrypto = Object.values(balances).reduce((total, userBalance) => {
    const cryptoTotal = (
      userBalance.BTC * 50000 +
      userBalance.ETH * 3000 +
      userBalance.XRP * 0.50
    );
    return total + cryptoTotal;
  }, 0);
  
  // Calculate total fiat holdings
  const totalFiat = Object.values(balances).reduce((total, userBalance) => {
    const fiatTotal = (
      userBalance.USD +
      userBalance.EUR * 1.18 +
      userBalance.GBP * 1.30
    );
    return total + fiatTotal;
  }, 0);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and statistics</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {verifiedUsers} verified ({Math.round((verifiedUsers / totalUsers) * 100)}%)
            </p>
          </CardContent>
        </Card>
        
        {/* Total Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              All assets combined
            </p>
          </CardContent>
        </Card>
        
        {/* Crypto Holdings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Crypto Holdings</CardTitle>
            <TrendingUp size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCrypto.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalCrypto / totalBalance) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        
        {/* Fiat Holdings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fiat Holdings</CardTitle>
            <TrendingDown size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalFiat.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalFiat / totalBalance) * 100)}% of total
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Users who have recently registered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-left p-3">KYC Status</th>
                  <th className="text-left p-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(user => !user.isAdmin).map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted">
                          <User size={16} />
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs 
                        ${user.kycVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {user.kycVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Admin;

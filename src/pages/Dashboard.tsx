
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import KYCVerification from '@/components/KYCVerification';
import BalanceCard from '@/components/dashboard/BalanceCard';
import MarketTrends from '@/components/dashboard/MarketTrends';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  
  // If KYC is not verified, show the KYC form
  if (user && !user.kycVerified) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Complete Verification</h1>
          <p className="text-muted-foreground mb-6">
            Please complete KYC verification to access all features of your account.
          </p>
          <KYCVerification />
        </div>
      </DashboardLayout>
    );
  }
  
  // KYC verified, show dashboard
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1">
          <BalanceCard />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          <MarketTrends />
        </div>
      </div>
      
      <div className="mt-6">
        <Tabs defaultValue="my-assets">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="my-assets">My Assets</TabsTrigger>
            <TabsTrigger value="trading-activities">Trading Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-assets">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Asset Distribution</CardTitle>
                <CardDescription>Breakdown of your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center justify-center border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">Asset chart will appear here</p>
                </div>
                <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                  <Button className="bg-trading-primary hover:bg-trading-secondary">Deposit</Button>
                  <Button variant="outline">Withdraw</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trading-activities">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Your trading history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-60 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No recent transactions</p>
                  <Button variant="link" className="text-trading-primary mt-2">
                    Make your first trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

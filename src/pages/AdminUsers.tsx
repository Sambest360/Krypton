
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Search, Check, X } from 'lucide-react';
import { useMockData } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AdminUsers = () => {
  const { users, balances, updateUserBalance } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [amount, setAmount] = useState('0');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.toLowerCase().includes(searchLower)
    );
  });
  
  const handleUpdateBalance = () => {
    if (selectedUser && selectedAsset) {
      const numAmount = parseFloat(amount);
      
      if (!isNaN(numAmount)) {
        updateUserBalance(
          selectedUser,
          selectedAsset as keyof typeof balances[string],
          numAmount
        );
        
        toast({
          title: "Balance Updated",
          description: `Successfully updated ${selectedAsset} balance for user.`,
        });
        
        setSelectedUser(null);
      }
    }
  };
  
  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    const user = users.find(u => u.id === userId);
    
    if (user) {
      setSelectedAsset('BTC');
      setAmount(balances[userId]?.BTC.toString() || '0');
    }
  };
  
  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset);
    if (selectedUser && balances[selectedUser]) {
      setAmount(balances[selectedUser][asset as keyof typeof balances[string]].toString());
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground">View and update user accounts</p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search users by name, email, or phone..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Select a user to update their balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">KYC Status</th>
                  <th className="text-left p-3">BTC</th>
                  <th className="text-left p-3">ETH</th>
                  <th className="text-left p-3">XRP</th>
                  <th className="text-left p-3">USD</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
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
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs 
                        ${user.kycVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {user.kycVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{balances[user.id]?.BTC.toFixed(5) || 0}</td>
                    <td className="p-3 font-mono">{balances[user.id]?.ETH.toFixed(5) || 0}</td>
                    <td className="p-3 font-mono">{balances[user.id]?.XRP.toFixed(1) || 0}</td>
                    <td className="p-3 font-mono">${balances[user.id]?.USD.toFixed(2) || 0}</td>
                    <td className="p-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleUserSelect(user.id)}>
                            Edit Balance
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update User Balance</DialogTitle>
                            <DialogDescription>
                              Adjust balance for {user.name} ({user.email})
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="asset">Select Asset</Label>
                              <Select
                                value={selectedAsset}
                                onValueChange={handleAssetChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select asset" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                                  <SelectItem value="XRP">XRP</SelectItem>
                                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="amount">Amount</Label>
                              <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                              />
                              <p className="text-xs text-muted-foreground">
                                Current balance: {
                                  selectedUser && selectedAsset
                                    ? balances[selectedUser]?.[selectedAsset as keyof typeof balances[string]] || 0
                                    : 0
                                }
                              </p>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <div className="flex space-x-2">
                              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                                <X className="mr-1 h-4 w-4" />
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateBalance} className="bg-trading-primary hover:bg-trading-secondary">
                                <Check className="mr-1 h-4 w-4" />
                                Update Balance
                              </Button>
                            </div>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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

export default AdminUsers;

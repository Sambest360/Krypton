
export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  image?: string;
}

export interface UserBalance {
  currency: string;
  amount: number;
  value: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  kycVerified: boolean;
  kycDocument?: string;
  isAdmin: boolean;
  createdAt: string;
  balances: UserBalance[];
}

export interface Transaction {
  id: string;
  userId: string;
  transactionType: 'DEPOSIT' | 'WITHDRAW' | 'BUY' | 'SELL';
  asset: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface MarketChartData {
  date: string;
  [key: string]: string | number;
}

export interface AdminDashboardData {
  totalUsers: number;
  kycVerifiedUsers: number;
  totalAssetValue: number;
  cryptoDistribution: {
    asset: string;
    value: number;
    percentage: number;
  }[];
  recentUsers: User[];
}

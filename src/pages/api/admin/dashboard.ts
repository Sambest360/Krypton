import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Missing Turso environment variables');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all users
    const usersResult = await client.execute('SELECT * FROM users ORDER BY created_at DESC');
    
    // Get all balances
    const balancesResult = await client.execute('SELECT * FROM balances');
    
    // Convert balances array to a record keyed by user_id
    const balances = balancesResult.rows.reduce((acc: Record<string, any>, row: any) => {
      const { user_id, ...balance } = row;
      acc[user_id] = balance;
      return acc;
    }, {});

    return res.status(200).json({
      users: usersResult.rows,
      balances
    });
  } catch (error) {
    console.error('Failed to fetch admin dashboard data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

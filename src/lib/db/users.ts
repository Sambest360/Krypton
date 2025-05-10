import { createClient } from '@libsql/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Missing Turso environment variables');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  kyc_verified: boolean;
  kyc_document: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type UserBalance = {
  btc: string;
  eth: string;
  xrp: string;
  usd: string;
  gbp: string;
  eur: string;
  updated_at: string;
};

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });

  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    kyc_verified: Boolean(row.kyc_verified),
    kyc_document: row.kyc_document as string | null,
    is_admin: Boolean(row.is_admin),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await client.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id]
  });

  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    kyc_verified: Boolean(row.kyc_verified),
    kyc_document: row.kyc_document as string | null,
    is_admin: Boolean(row.is_admin),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string
  };
}

export async function getUserBalance(userId: string): Promise<UserBalance | null> {
  const result = await client.execute({
    sql: 'SELECT * FROM balances WHERE user_id = ?',
    args: [userId]
  });

  const row = result.rows[0];
  if (!row) return null;

  return {
    btc: row.btc as string,
    eth: row.eth as string,
    xrp: row.xrp as string,
    usd: row.usd as string,
    gbp: row.gbp as string,
    eur: row.eur as string,
    updated_at: row.updated_at as string
  };
}

export async function createUser(
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<User> {
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);

  await client.execute({
    sql: `INSERT INTO users (id, name, email, phone, password_hash, is_admin, kyc_verified) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, name, email, phone, passwordHash, false, false]
  });

  // Create initial balance
  await client.execute({
    sql: `INSERT INTO balances (user_id, btc, eth, xrp, usd, gbp, eur) 
          VALUES (?, '0', '0', '0', '0', '0', '0')`,
    args: [id]
  });

  const user = await getUserById(id);
  if (!user) throw new Error('Failed to create user');

  return user;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  const result = await client.execute({
    sql: 'SELECT password_hash FROM users WHERE id = ?',
    args: [user.id]
  });

  const row = result.rows[0];
  if (!row || !row.password_hash) return false;

  return bcrypt.compare(password, row.password_hash as string);
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const setClauses = [];
  const args = [];

  for (const [key, value] of Object.entries(updates)) {
    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
      setClauses.push(`${key} = ?`);
      args.push(value);
    }
  }

  if (setClauses.length > 0) {
    args.push(id);
    await client.execute({
      sql: `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`,
      args
    });
  }

  const user = await getUserById(id);
  if (!user) throw new Error('User not found');

  return user;
}

export async function updateUserBalance(
  userId: string,
  asset: keyof UserBalance,
  amount: string
): Promise<UserBalance> {
  await client.execute({
    sql: `UPDATE balances SET ${asset} = ? WHERE user_id = ?`,
    args: [amount, userId]
  });

  const balance = await getUserBalance(userId);
  if (!balance) throw new Error('Balance not found');

  return balance;
}

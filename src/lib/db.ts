import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not defined in environment variables');
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not defined in environment variables');
}

// Create database client with error handling
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Custom error types
export class DatabaseError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class AuthenticationError extends DatabaseError {
  constructor(message: string = 'Database authentication failed', cause?: Error) {
    super(message, cause);
    this.name = 'AuthenticationError';
  }
}

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await client.execute({ sql: text, args: params });
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration });
    return result.rows;
  } catch (error: any) {
    if (error.code === 'SERVER_ERROR' && error.cause?.status === 401) {
      throw new AuthenticationError('Database authentication failed', error);
    }
    throw new DatabaseError(`Query failed: ${text}`, error);
  }
};

export const testConnection = async () => {
  try {
    await client.execute({ sql: 'SELECT 1' });
    console.log('✅ Successfully connected to Turso database!');
    return true;
  } catch (error: any) {
    if (error.code === 'SERVER_ERROR' && error.cause?.status === 401) {
      throw new AuthenticationError('Failed to authenticate with Turso database', error);
    }
    throw new DatabaseError('Failed to connect to database', error);
  }
};

// Helper functions for common operations
export const findUserByEmail = async (email: string) => {
  const result = await query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  ) as any[];
  return result[0];
};

export const createUser = async (
  name: string,
  email: string,
  phone: string,
  passwordHash: string,
  isAdmin: boolean = false
) => {
  try {
    // Insert user with UUID
    const [userResult] = await query(
      `INSERT INTO users (id, name, email, phone, password_hash, is_admin)
       VALUES (UUID(), ?, ?, ?, ?, ?) RETURNING id`,
      [name, email, phone, passwordHash, isAdmin]
    ) as any[];
    
    const userId = userResult[0].id;
    
    // Initialize balance
    await query(
      `INSERT INTO balances (user_id)
       VALUES (?)`,
      [userId]
    );
    
    return userId;
  } catch (error) {
    throw error;
  }
};

export const updateUserBalance = async (
  userId: string,
  asset: string,
  amount: number
) => {
  try {
    // Update balance
    await query(
      `UPDATE balances 
       SET ${asset.toLowerCase()} = ?
       WHERE user_id = ?`,
      [amount, userId]
    );
    
    // Record transaction
    await query(
      `INSERT INTO transaction_history 
       (id, user_id, transaction_type, asset, amount, status)
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [userId, 'UPDATE', asset, amount, 'COMPLETED']
    );
  } catch (error) {
    throw error;
  }
};

export const createPasswordResetToken = async (userId: string) => {
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour
  
  await query(
    `INSERT INTO password_reset_tokens (id, user_id, token, expires_at)
     VALUES (UUID(), ?, ?, ?)`,
    [userId, token, expiresAt]
  );
  
  return token;
};

export const validatePasswordResetToken = async (token: string) => {
  const result = await query(
    `SELECT user_id FROM password_reset_tokens
     WHERE token = ? AND expires_at > NOW()`,
    [token]
  ) as any[];
  
  return result[0]?.user_id;
};

export const getUserBalances = async (userId: string) => {
  const result = await query(
    'SELECT * FROM balances WHERE user_id = ?',
    [userId]
  ) as any[];
  return result[0];
};

export const getTransactionHistory = async (userId: string, limit = 10) => {
  return await query(
    `SELECT * FROM transaction_history 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [userId, limit]
  );
};

export const updateKYCStatus = async (userId: string, verified: boolean, documentUrl?: string) => {
  await query(
    `UPDATE users 
     SET kyc_verified = ?, 
         kyc_document = ?
     WHERE id = ?`,
    [verified, documentUrl, userId]
  );
};

export const createTransaction = async (
  userId: string,
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE',
  asset: string,
  amount: number
) => {
  try {
    // Create transaction record
    await query(
      `INSERT INTO transaction_history 
       (id, user_id, transaction_type, asset, amount, status)
       VALUES (UUID(), ?, ?, ?, ?, 'PENDING')`,
      [userId, type, asset, amount]
    );
    
    // Update balance based on transaction type
    const modifier = type === 'WITHDRAWAL' ? -1 : 1;
    await query(
      `UPDATE balances 
       SET ${asset.toLowerCase()} = ${asset.toLowerCase()} + ?
       WHERE user_id = ?`,
      [amount * modifier, userId]
    );
    
    // Update transaction status to completed
    await query(
      `UPDATE transaction_history 
       SET status = 'COMPLETED'
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );
  } catch (error) {
    throw error;
  }
};

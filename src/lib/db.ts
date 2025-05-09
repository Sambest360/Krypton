import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      database: process.env.MYSQL_DB || 'Krypton',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false
      }
    });


export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const [rows] = await pool.execute(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration });
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getConnection = async () => await pool.getConnection();

// Test database connection
export const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Successfully connected to the database!');
    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
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
  const conn = await getConnection();
  try {
    await conn.beginTransaction();
    
    // Insert user with UUID
    const [userResult] = await conn.execute(
      `INSERT INTO users (id, name, email, phone, password_hash, is_admin)
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [name, email, phone, passwordHash, isAdmin]
    ) as any;
    
    const [userIdResult] = await conn.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any[];
    
    const userId = userIdResult[0].id;
    
    // Initialize balance
    await conn.execute(
      `INSERT INTO balances (user_id)
       VALUES (?)`,
      [userId]
    );
    
    await conn.commit();
    return userId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const updateUserBalance = async (
  userId: string,
  asset: string,
  amount: number
) => {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();
    
    // Update balance
    await conn.execute(
      `UPDATE balances 
       SET ${asset.toLowerCase()} = ?
       WHERE user_id = ?`,
      [amount, userId]
    );
    
    // Record transaction
    await conn.execute(
      `INSERT INTO transaction_history 
       (id, user_id, transaction_type, asset, amount, status)
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [userId, 'UPDATE', asset, amount, 'COMPLETED']
    );
    
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
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
  const conn = await getConnection();
  try {
    await conn.beginTransaction();
    
    // Create transaction record
    await conn.execute(
      `INSERT INTO transaction_history 
       (id, user_id, transaction_type, asset, amount, status)
       VALUES (UUID(), ?, ?, ?, ?, 'PENDING')`,
      [userId, type, asset, amount]
    );
    
    // Update balance based on transaction type
    const modifier = type === 'WITHDRAWAL' ? -1 : 1;
    await conn.execute(
      `UPDATE balances 
       SET ${asset.toLowerCase()} = ${asset.toLowerCase()} + ?
       WHERE user_id = ?`,
      [amount * modifier, userId]
    );
    
    // Update transaction status to completed
    await conn.execute(
      `UPDATE transaction_history 
       SET status = 'COMPLETED'
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );
    
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

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

// Database configuration validation
const validateConfig = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new DatabaseError(
      'TURSO_DATABASE_URL is not defined in environment variables. ' +
      'Please ensure you have a .env file with the correct configuration.'
    );
  }

  if (!authToken) {
    throw new DatabaseError(
      'TURSO_AUTH_TOKEN is not defined in environment variables. ' +
      'Please ensure you have a .env file with the correct configuration.'
    );
  }

  return { url, authToken };
};

// Create database client with connection retry
const createDbClient = () => {
  const config = validateConfig();
  
  return createClient({
    url: config.url,
    authToken: config.authToken,
    fetch: (url, init) => {
      const timeout = 10000; // 10 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      return fetch(url, {
        ...init,
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
    }
  });
};

const client = createDbClient();

// Test database connection
export const testConnection = async () => {
  try {
    const result = await client.execute({ sql: 'SELECT 1' });
    console.log('✅ Successfully connected to Turso database!');
    console.log('Database URL:', process.env.TURSO_DATABASE_URL);
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.code === 'SERVER_ERROR' && error.cause?.status === 401) {
      throw new AuthenticationError(
        'Failed to authenticate with Turso database. ' +
        'Please check your TURSO_AUTH_TOKEN.',
        error
      );
    }
    
    if (error.name === 'AbortError') {
      throw new DatabaseError(
        'Database connection timed out. ' +
        'Please check your network connection and database URL.',
        error
      );
    }
    
    throw new DatabaseError('Failed to connect to database', error);
  }
};

// Query wrapper with improved error handling
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await client.execute({ sql: text, args: params });
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rowCount: result.rows.length });
    return result.rows;
  } catch (error: any) {
    console.error('Query failed:', error.message);
    
    if (error.code === 'SERVER_ERROR' && error.cause?.status === 401) {
      throw new AuthenticationError(error.message, error);
    }
    
    if (error.name === 'AbortError') {
      throw new DatabaseError('Query timed out', error);
    }
    
    throw new DatabaseError(`Query failed: ${text}`, error);
  }
};

// Export the client for direct usage if needed
export const db = client;

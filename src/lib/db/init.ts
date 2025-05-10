import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Missing Turso environment variables');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initializeDatabase() {
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each statement
    for (const statement of statements) {
      await client.execute({ sql: statement });
    }

    console.log('Database initialized successfully');

    // Create admin user if it doesn't exist
    const adminEmail = 'admin@wealthhaven.com';
    const adminResult = await client.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [adminEmail]
    });

    if (adminResult.rows.length === 0) {
      await client.execute({
        sql: `INSERT INTO users (id, name, email, phone, password_hash, is_admin, kyc_verified) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          'admin',
          'Admin',
          adminEmail,
          '+1234567890',
          '$2b$10$rKrLGqKqTq8PF.Z5QyR1p.BX0rGMs2ZqX1QR1YJdBZ7V4ZJ1Qq5Gy', // Password: Admin123!
          true,
          true
        ]
      });

      await client.execute({
        sql: `INSERT INTO balances (user_id, btc, eth, xrp, usd, gbp, eur) 
              VALUES (?, '10', '100', '1000', '100000', '75000', '85000')`,
        args: ['admin']
      });

      console.log('Admin user created successfully');
    }

  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Run initialization
initializeDatabase().catch(console.error);

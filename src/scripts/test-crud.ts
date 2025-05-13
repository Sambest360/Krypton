import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import { webcrypto } from 'crypto';

dotenv.config();

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  });

  try {
    // 1. Create a new test user
    console.log('\nCreating test user...');
    const userId = webcrypto.randomUUID();
    await client.execute({
      sql: `INSERT INTO users (id, name, email, phone, password_hash, kyc_verified)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [userId, 'Test User', 'test@example.com', '+1234567890', 'test_hash', false]
    });
    console.log('✅ User created with ID:', userId);

    // 2. Initialize user balance
    console.log('\nInitializing user balance...');
    await client.execute({
      sql: `INSERT INTO balances (user_id, btc, eth, xrp, usd, gbp, eur)
            VALUES (?, '0.1', '1.5', '100', '5000', '4000', '4500')`,
      args: [userId]
    });
    console.log('✅ Balance initialized');

    // 3. Read user balance
    console.log('\nReading user balance...');
    const balance = await client.execute({
      sql: 'SELECT * FROM balances WHERE user_id = ?',
      args: [userId]
    });
    console.log('✅ User balance:', balance.rows[0]);

    // 4. Create a test transaction
    console.log('\nCreating test transaction...');
    await client.execute({
      sql: `INSERT INTO transaction_history 
            (id, user_id, transaction_type, asset, amount, status)
            VALUES (?, ?, 'DEPOSIT', 'BTC', '0.1', 'COMPLETED')`,
      args: [webcrypto.randomUUID(), userId]
    });
    console.log('✅ Transaction created');

    // 5. Read transaction history
    console.log('\nReading transaction history...');
    const transactions = await client.execute({
      sql: `SELECT * FROM transaction_history 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 5`,
      args: [userId]
    });
    console.log('✅ Recent transactions:', transactions.rows);

    // 6. Clean up test data
    console.log('\nCleaning up test data...');
    await client.execute({
      sql: 'DELETE FROM transaction_history WHERE user_id = ?',
      args: [userId]
    });
    await client.execute({
      sql: 'DELETE FROM balances WHERE user_id = ?',
      args: [userId]
    });
    await client.execute({
      sql: 'DELETE FROM users WHERE id = ?',
      args: [userId]
    });
    console.log('✅ Test data cleaned up');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  }
}

main();

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function testTables() {
  let connection;
  try {
    // Connect to the database
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('Connected to database');

    // Test creating a user
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    await connection.execute(`
      INSERT INTO users (id, name, email, password_hash) 
      VALUES (?, ?, ?, ?)
    `, [userId, 'Test User', 'test@example.com', 'hashedpassword123']);
    console.log('Created test user');

    // Test creating a balance
    await connection.execute(`
      INSERT INTO balances (id, user_id, usd, btc) 
      VALUES (?, ?, ?, ?)
    `, ['123e4567-e89b-12d3-a456-426614174001', userId, 1000.00, 0.5]);
    console.log('Created test balance');

    // Test creating a transaction
    await connection.execute(`
      INSERT INTO transactions (id, user_id, type, amount, asset, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['123e4567-e89b-12d3-a456-426614174002', userId, 'deposit', 1000.00, 'USD', 'completed']);
    console.log('Created test transaction');

    // Test creating KYC record
    await connection.execute(`
      INSERT INTO kyc (id, user_id, status, document_type, document_number) 
      VALUES (?, ?, ?, ?, ?)
    `, ['123e4567-e89b-12d3-a456-426614174003', userId, 'pending', 'passport', 'ABC123']);
    console.log('Created test KYC record');

    // Query and verify all records
    const [users] = await connection.execute('SELECT * FROM users');
    console.log('\nUsers:', users);

    const [balances] = await connection.execute('SELECT * FROM balances');
    console.log('\nBalances:', balances);

    const [transactions] = await connection.execute('SELECT * FROM transactions');
    console.log('\nTransactions:', transactions);

    const [kyc] = await connection.execute('SELECT * FROM kyc');
    console.log('\nKYC:', kyc);

    // Clean up test data
    await connection.execute('DELETE FROM kyc WHERE user_id = ?', [userId]);
    await connection.execute('DELETE FROM transactions WHERE user_id = ?', [userId]);
    await connection.execute('DELETE FROM balances WHERE user_id = ?', [userId]);
    await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
    console.log('\nTest data cleaned up');

  } catch (error) {
    console.error('Error testing tables:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testTables();

import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Missing Turso environment variables');
}

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  // Admin user data
  const adminUser = {
    id: uuidv4(),
    name: 'Admin User',
    email: `admin${Date.now()}@example.com`,
    phone: '+1234567890',
    password_hash: await bcrypt.hash('admin123', 10),
    is_admin: true,
    kyc_verified: true
  };

  try {
    // Insert admin user
    await client.execute({
      sql: `INSERT INTO users (id, name, email, phone, password_hash, is_admin, kyc_verified) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        adminUser.id,
        adminUser.name,
        adminUser.email,
        adminUser.phone,
        adminUser.password_hash,
        adminUser.is_admin,
        adminUser.kyc_verified
      ]
    });

    // Create initial balance
    await client.execute({
      sql: `INSERT INTO balances (user_id, btc, eth, xrp, usd, gbp, eur) 
            VALUES (?, '0', '0', '0', '0', '0', '0')`,
      args: [adminUser.id]
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');

    // Verify the user was created
    const user = await client.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [adminUser.email]
    });

    console.log('\nUser record:', user.rows[0]);

    const balance = await client.execute({
      sql: 'SELECT * FROM balances WHERE user_id = ?',
      args: [adminUser.id]
    });

    console.log('\nBalance record:', balance.rows[0]);

  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

main();

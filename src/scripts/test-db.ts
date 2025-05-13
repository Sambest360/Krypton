import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  });

  try {
    console.log('Testing connection to:', process.env.TURSO_DATABASE_URL);
    const result = await client.execute('SELECT 1');
    console.log('✅ Connection successful!');
    
    console.log('\nTesting users table...');
    const users = await client.execute(`
      SELECT COUNT(*) as count 
      FROM users
    `);
    console.log('Users count:', users.rows[0].count);
    
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  }
}

main().catch(console.error);

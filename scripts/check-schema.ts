import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Missing Turso environment variables');
}

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    const tables = await client.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table';`
    });

    console.log('Tables in database:', tables.rows);

    for (const table of tables.rows) {
      const tableName = table.name;
      const columns = await client.execute({
        sql: `PRAGMA table_info(${tableName});`
      });
      console.log(`\nColumns in ${tableName}:`, columns.rows);
    }

  } catch (error) {
    console.error('Failed to check schema:', error);
    process.exit(1);
  }
}

main();

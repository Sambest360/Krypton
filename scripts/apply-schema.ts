import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not defined');
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not defined');
}

async function main() {
  console.log('🚀 Applying schema to database...');

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    // Read the migration file
    const migrationPath = join(process.cwd(), 'drizzle/migrations/0000_superb_mister_sinister.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    // Split the migration into individual statements
    const statements = migrationSQL.split('-->\u0020statement-breakpoint');

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.execute({ sql: statement.trim() });
          console.log('✅ Applied statement successfully');
        } catch (error: any) {
          if (error.message?.includes('already exists')) {
            console.log('⚠️ Table already exists, skipping...');
          } else {
            throw error;
          }
        }
      }
    }

    console.log('✅ Schema applied successfully!');
  } catch (error) {
    console.error('❌ Failed to apply schema:', error);
    process.exit(1);
  }
}

main();

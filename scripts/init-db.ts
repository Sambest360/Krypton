import { testConnection, query } from '../src/lib/db.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
  let conn;
  try {
    // Test connection
    conn = await testConnection();
    if (!conn) {
      throw new Error('Failed to connect to database');
    }
    console.log('Database connection successful!');

    // Read schema file
    const schemaPath = join(__dirname, '..', 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each statement
    for (const statement of statements) {
      await query(statement);
      console.log('Executed:', statement.substring(0, 50) + '...');
    }

    console.log('Database schema initialized successfully!');
    if (conn) {
      conn.release();
    }
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Stack trace:', error?.stack);
    if (conn) {
      conn.release();
    }
    process.exit(1);
  }
}

initializeDatabase();

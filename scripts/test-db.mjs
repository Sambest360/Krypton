import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function testDatabaseConnection() {
  let connection;
  try {
    // First connect without database to create it
    const baseConfig = {
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      ssl: {
        rejectUnauthorized: false
      }
    };

    // Create initial connection
    connection = await mysql.createConnection(baseConfig);
    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DB}`);
    console.log(`Created/verified database ${process.env.MYSQL_DB}`);

    // Close initial connection
    await connection.end();

    // Connect to the specific database
    const dbConfig = {
      ...baseConfig,
      database: process.env.MYSQL_DB
    };
    connection = await mysql.createConnection(dbConfig);
    console.log(`Successfully connected to ${process.env.MYSQL_DB} database!`);
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1');
    console.log('Test query successful:', rows);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Database connection error:', error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

testDatabaseConnection();

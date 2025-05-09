import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const tables = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  // Balances table
  `CREATE TABLE IF NOT EXISTS balances (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    usd DECIMAL(20, 8) DEFAULT 0,
    eur DECIMAL(20, 8) DEFAULT 0,
    gbp DECIMAL(20, 8) DEFAULT 0,
    btc DECIMAL(20, 8) DEFAULT 0,
    eth DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,

  // Transactions table
  `CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    asset VARCHAR(10) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,

  // KYC table
  `CREATE TABLE IF NOT EXISTS kyc (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`
];

async function importSchema() {
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

    // Create tables
    for (const table of tables) {
      await connection.execute(table);
      console.log('Created table successfully');
    }

    console.log('Schema import completed successfully!');
  } catch (error) {
    console.error('Error importing schema:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

importSchema();

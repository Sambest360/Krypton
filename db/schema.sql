-- Create users table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    kyc_verified BOOLEAN DEFAULT FALSE,
    kyc_document VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create balances table
CREATE TABLE balances (
    user_id CHAR(36) PRIMARY KEY,
    btc DECIMAL(20, 8) DEFAULT 0,
    eth DECIMAL(20, 8) DEFAULT 0,
    xrp DECIMAL(20, 8) DEFAULT 0,
    usd DECIMAL(20, 2) DEFAULT 0,
    gbp DECIMAL(20, 2) DEFAULT 0,
    eur DECIMAL(20, 2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create password_reset_tokens table
CREATE TABLE password_reset_tokens (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create transaction_history table
CREATE TABLE transaction_history (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL COMMENT 'DEPOSIT, WITHDRAWAL, TRADE',
    asset VARCHAR(10) NOT NULL COMMENT 'BTC, ETH, XRP, USD, GBP, EUR',
    amount DECIMAL(20, 8) NOT NULL,
    status VARCHAR(20) NOT NULL COMMENT 'PENDING, COMPLETED, FAILED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


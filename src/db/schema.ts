import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  passwordHash: text('password_hash').notNull(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
  kycVerified: integer('kyc_verified', { mode: 'boolean' }).notNull().default(false),
  kycDocument: text('kyc_document'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const balances = sqliteTable('balances', {
  id: text('id').primaryKey().default(sql`(uuid())`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  btc: text('btc').notNull().default('0'),
  eth: text('eth').notNull().default('0'),
  usdt: text('usdt').notNull().default('0'),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const transactionHistory = sqliteTable('transaction_history', {
  id: text('id').primaryKey().default(sql`(uuid())`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  transactionType: text('transaction_type', {
    enum: ['DEPOSIT', 'WITHDRAWAL', 'TRADE', 'UPDATE']
  }).notNull(),
  asset: text('asset').notNull(),
  amount: text('amount').notNull(),
  status: text('status', {
    enum: ['PENDING', 'COMPLETED', 'FAILED']
  }).notNull().default('PENDING'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const passwordResetTokens = sqliteTable('password_reset_tokens', {
  id: text('id').primaryKey().default(sql`(uuid())`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

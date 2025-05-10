import { testConnection, AuthenticationError, DatabaseError } from '../src/lib/db';

async function main() {
  try {
    await testConnection();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('❌ Authentication failed: Please check your TURSO_AUTH_TOKEN');
      console.error('Hint: Make sure there is no extra text in your auth token');
    } else if (error instanceof DatabaseError) {
      console.error('❌ Database error:', error.message);
      if (error.cause) {
        console.error('Cause:', error.cause);
      }
    } else {
      console.error('❌ Unexpected error:', error);
    }
    process.exit(1);
  }
}

main();

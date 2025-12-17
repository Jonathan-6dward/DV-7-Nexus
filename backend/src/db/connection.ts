// backend/src/db/connection.ts
import { drizzle } from 'drizzle-orm/mysql2';
import { createConnection } from 'mysql2/promise';
import { env } from '../config/env';

let connection: Awaited<ReturnType<typeof createConnection>>;
let dbInstance: ReturnType<typeof drizzle>;

export async function getDb() {
  if (!dbInstance) {
    if (!connection) {
      connection = await createConnection({
        host: env.DB_HOST || 'localhost',
        port: parseInt(env.DB_PORT || '3306'),
        user: env.DB_USER || 'root',
        password: env.DB_PASS || '',
        database: env.DB_NAME || 'dv7_nexus',
      });
    }
    
    dbInstance = drizzle(connection);
  }
  
  return dbInstance;
}

// Export individual functions to maintain compatibility
export {
  eq,
  and,
  or,
  sql,
  asc,
  desc,
} from 'drizzle-orm';
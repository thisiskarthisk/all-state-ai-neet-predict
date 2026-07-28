import { Pool } from 'pg';

let pool: Pool;

const dbConfig = {
  // host: process.env.DB_HOST || 'localhost',
  // port: parseInt(process.env.DB_PORT || '5432'),
  // user: process.env.DB_USER || 'odoo_user',
  // password: process.env.DB_PASS || 'letmein1!',
  // database: process.env.DB_NAME || 'Proflujo-neet-predictor',
  // max: 10,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
};

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(dbConfig);
} else {
  // Prevent multiple pool instances in development HMR
  if (!(global as any)._postgresPool) {
    (global as any)._postgresPool = new Pool(dbConfig);
  }
  pool = (global as any)._postgresPool;
}

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

export default pool;

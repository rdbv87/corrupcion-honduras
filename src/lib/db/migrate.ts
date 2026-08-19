import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const schemaPath = join(process.cwd(), 'src', 'lib', 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    await client.query(schema);
    
    await client.query('COMMIT');
    console.log('Migración completada exitosamente');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en la migración:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(console.error);

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Create migrations table if it doesn't exist
async function initMigrationsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Error creating migrations table:', error);
    throw error;
  }
}

// Get list of executed migrations
async function getExecutedMigrations() {
  const { rows } = await pool.query('SELECT name FROM migrations');
  return rows.map(row => row.name);
}

// Get all migration files
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  // Create migrations directory if it doesn't exist
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }
  
  return fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
}

// Execute a single migration
async function executeMigration(migrationFile) {
  const filePath = path.join(__dirname, 'migrations', migrationFile);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Execute the migration
    await client.query(sql);
    
    // Record the migration
    await client.query(
      'INSERT INTO migrations (name) VALUES ($1)',
      [migrationFile]
    );
    
    await client.query('COMMIT');
    console.log(`✅ Executed migration: ${migrationFile}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Error executing migration ${migrationFile}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

// Create a new migration file
function createMigration(name) {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const fileName = `${timestamp}_${name}.sql`;
  const filePath = path.join(__dirname, 'migrations', fileName);
  
  const template = `-- Migration: ${name}
-- Created at: ${new Date().toISOString()}

-- Write your SQL here

-- Add up migration

-- Add down migration if needed
`;

  fs.writeFileSync(filePath, template);
  console.log(`Created migration file: ${fileName}`);
}

// Main migration function
async function migrate() {
  try {
    await initMigrationsTable();
    
    const executedMigrations = await getExecutedMigrations();
    const migrationFiles = getMigrationFiles();
    
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }
    
    console.log(`Found ${pendingMigrations.length} pending migrations`);
    
    for (const migration of pendingMigrations) {
      await executeMigration(migration);
    }
    
    console.log('✨ All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'create':
      if (!args[1]) {
        console.error('Please provide a migration name');
        process.exit(1);
      }
      createMigration(args[1]);
      break;
      
    case 'up':
      migrate().catch(console.error);
      break;
      
    case '--help':
    case '-h':
      console.log(`
Database Migration Tool

Usage:
  node migrate.js <command> [options]

Commands:
  create <name>    Create a new migration file
  up              Run all pending migrations
  --help, -h      Show this help message

Examples:
  node migrate.js create add-users-table
  node migrate.js up
`);
      break;
      
    default:
      console.error('Unknown command. Use --help for usage information.');
      process.exit(1);
  }
}

module.exports = {
  migrate,
  createMigration,
  initMigrationsTable,
};

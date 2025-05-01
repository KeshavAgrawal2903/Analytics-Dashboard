const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
};

async function initializeDatabase() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('🔄 Initializing database...');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await pool.query(schema);
    console.log('✅ Database schema created successfully');

    // Generate sample data from sampleData.ts
    console.log('📊 Generating sample data...');
    
    // Import the sample data generation function
    const { sampleOrders } = require('../../client/src/utils/sampleData.ts');
    
    // Insert sample orders
    for (const order of sampleOrders) {
      await pool.query(`
        INSERT INTO orders (
          order_id, customer_name, location, state,
          amount, status, category, shipment_type, size
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        order.orderId,
        order.customerName,
        order.location,
        order.state,
        order.amount,
        order.status,
        order.category,
        order.shipmentType,
        order.size
      ]);
    }
    console.log(`✅ Inserted ${sampleOrders.length} sample orders`);

    // Generate analytics data
    await pool.query(`
      INSERT INTO analytics (
        date, total_revenue, total_orders,
        average_order_value, state, category
      )
      SELECT 
        DATE(created_at),
        SUM(amount),
        COUNT(*),
        AVG(amount),
        state,
        category
      FROM orders
      GROUP BY DATE(created_at), state, category
    `);
    console.log('✅ Generated analytics data');

    console.log('🎉 Database initialization completed successfully!');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Add command line argument support
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Database Initialization Script

Usage:
  node init-db.js [options]

Options:
  --help, -h     Show this help message
  --force, -f    Force initialization (drops existing tables)

Environment Variables Required:
  DB_USER        Database user
  DB_PASSWORD    Database password
  DB_HOST        Database host
  DB_PORT        Database port
  DB_NAME        Database name
    `);
    process.exit(0);
  }

  initializeDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}

module.exports = initializeDatabase;

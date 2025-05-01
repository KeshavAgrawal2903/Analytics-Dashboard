-- Drop tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create analytics table
CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total_revenue DECIMAL(15,2) NOT NULL,
    total_orders INTEGER NOT NULL,
    average_order_value DECIMAL(10,2) NOT NULL,
    state VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    currency VARCHAR(10) DEFAULT 'INR',
    time_zone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    language VARCHAR(10) DEFAULT 'en-IN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_state ON orders(state);
CREATE INDEX idx_analytics_date ON analytics(date);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert test user (password: password123)
INSERT INTO users (email, password_hash, full_name)
VALUES (
    'test@example.com',
    '$2a$10$6KrJVh.pZ6ULjyMFqMpX5.YzQPjsAkVV/4kfVwQtXkrV2VlrWcGjy',
    'Test User'
);

-- Insert test settings for the test user
INSERT INTO settings (user_id, currency, time_zone, language)
VALUES (
    1,
    'INR',
    'Asia/Kolkata',
    'en-IN'
);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO CURRENT_USER;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO CURRENT_USER;

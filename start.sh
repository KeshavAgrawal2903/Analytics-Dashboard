#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    # Check if npm is installed
    if ! command_exists npm; then
        echo "❌ npm is not installed. Please install Node.js and npm first."
        exit 1
    fi

    # Install server dependencies
    echo "Installing server dependencies..."
    cd server
    npm install
    cd ..

    # Install client dependencies
    echo "Installing client dependencies..."
    cd client
    npm install
    cd ..
}

# Function to check and create .env file if not exists
setup_env() {
    echo "🔧 Setting up environment..."
    
    if [ ! -f "./server/.env" ]; then
        echo "Creating .env file..."
        cat > ./server/.env << EOL
PORT=5001
JWT_SECRET=your_jwt_secret_key
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=analytics_dashboard
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
EOL
        echo "⚠️ Please update the .env file with your actual configuration values"
    fi
}

# Function to kill existing processes
kill_existing() {
    echo "🔄 Cleaning up existing processes..."
    kill $(lsof -t -i:3000,5001) 2>/dev/null || true
}

# Function to start the application
start_app() {
    echo "🚀 Starting the application..."
    
    # Start server in background
    cd server
    PORT=5001 node server.js &
    SERVER_PID=$!
    cd ..

    # Start client in background
    cd client
    npm run start &
    CLIENT_PID=$!
    cd ..

    # Save PIDs for later cleanup
    echo $SERVER_PID > .server.pid
    echo $CLIENT_PID > .client.pid

    echo "✅ Application started successfully!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔌 Backend: http://localhost:5001"
    
    # Wait for both processes
    wait $SERVER_PID $CLIENT_PID
}

# Function to handle cleanup on script exit
cleanup() {
    echo "🧹 Cleaning up..."
    if [ -f .server.pid ]; then
        kill $(cat .server.pid) 2>/dev/null || true
        rm .server.pid
    fi
    if [ -f .client.pid ]; then
        kill $(cat .client.pid) 2>/dev/null || true
        rm .client.pid
    fi
}

# Main script execution
main() {
    echo "🌟 Analytics Dashboard Startup Script"
    
    # Set up trap for cleanup
    trap cleanup EXIT
    
    # Run setup steps
    install_dependencies
    setup_env
    kill_existing
    start_app
}

# Run the main function
main

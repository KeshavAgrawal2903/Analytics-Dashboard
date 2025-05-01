#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to show script usage
show_usage() {
    echo -e "${YELLOW}Analytics Dashboard Development Helper Script${NC}"
    echo
    echo "Usage: ./dev.sh [command]"
    echo
    echo "Commands:"
    echo "  install     - Install all dependencies"
    echo "  start      - Start development environment"
    echo "  test       - Run all tests"
    echo "  lint       - Run linting"
    echo "  clean      - Clean up node_modules and build files"
    echo "  db:init    - Initialize database"
    echo "  db:migrate - Run database migrations"
    echo "  help       - Show this help message"
}

# Function to check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed${NC}"
        exit 1
    fi
}

# Function to check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Error: npm is not installed${NC}"
        exit 1
    fi
}

# Function to install dependencies
install_deps() {
    echo -e "${YELLOW}Installing root dependencies...${NC}"
    npm install

    echo -e "${YELLOW}Installing server dependencies...${NC}"
    cd server && npm install
    cd ..

    echo -e "${YELLOW}Installing client dependencies...${NC}"
    cd client && npm install
    cd ..

    echo -e "${GREEN}All dependencies installed successfully!${NC}"
}

# Function to clean up
cleanup() {
    echo -e "${YELLOW}Cleaning up...${NC}"
    
    # Remove node_modules
    find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
    
    # Remove build directories
    rm -rf client/dist client/build server/dist server/build
    
    # Remove logs
    rm -rf logs/*.log
    
    echo -e "${GREEN}Cleanup completed!${NC}"
}

# Function to run all tests
run_tests() {
    echo -e "${YELLOW}Running server tests...${NC}"
    cd server && npm test
    SERVER_TEST_EXIT_CODE=$?
    cd ..

    echo -e "${YELLOW}Running client tests...${NC}"
    cd client && npm test
    CLIENT_TEST_EXIT_CODE=$?
    cd ..

    if [ $SERVER_TEST_EXIT_CODE -eq 0 ] && [ $CLIENT_TEST_EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}All tests passed!${NC}"
        exit 0
    else
        echo -e "${RED}Some tests failed!${NC}"
        exit 1
    fi
}

# Function to run linting
run_lint() {
    echo -e "${YELLOW}Linting server code...${NC}"
    cd server && npm run lint
    SERVER_LINT_EXIT_CODE=$?
    cd ..

    echo -e "${YELLOW}Linting client code...${NC}"
    cd client && npm run lint
    CLIENT_LINT_EXIT_CODE=$?
    cd ..

    if [ $SERVER_LINT_EXIT_CODE -eq 0 ] && [ $CLIENT_LINT_EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}Linting passed!${NC}"
        exit 0
    else
        echo -e "${RED}Linting failed!${NC}"
        exit 1
    fi
}

# Function to initialize database
init_db() {
    echo -e "${YELLOW}Initializing database...${NC}"
    cd server && node database/init-db.js
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Database initialized successfully!${NC}"
    else
        echo -e "${RED}Database initialization failed!${NC}"
        exit 1
    fi
    cd ..
}

# Function to run database migrations
run_migrations() {
    echo -e "${YELLOW}Running database migrations...${NC}"
    cd server && node database/migrate.js up
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Migrations completed successfully!${NC}"
    else
        echo -e "${RED}Migrations failed!${NC}"
        exit 1
    fi
    cd ..
}

# Check prerequisites
check_node
check_npm

# Main script logic
case "$1" in
    install)
        install_deps
        ;;
    
    start)
        ./start.sh
        ;;
    
    test)
        run_tests
        ;;
    
    lint)
        run_lint
        ;;
    
    clean)
        cleanup
        ;;
    
    db:init)
        init_db
        ;;
    
    db:migrate)
        run_migrations
        ;;
    
    help)
        show_usage
        ;;
    
    *)
        show_usage
        exit 1
        ;;
esac

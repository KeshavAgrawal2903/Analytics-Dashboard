#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to show script usage
show_usage() {
    echo -e "${YELLOW}Analytics Dashboard Docker Management Script${NC}"
    echo
    echo "Usage: ./docker.sh [command]"
    echo
    echo "Commands:"
    echo "  start       - Start all services"
    echo "  stop        - Stop all services"
    echo "  restart     - Restart all services"
    echo "  build       - Rebuild all services"
    echo "  logs        - Show logs from all services"
    echo "  ps          - Show running services"
    echo "  clean       - Remove all containers and volumes"
    echo "  db-reset    - Reset the database"
    echo "  help        - Show this help message"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        exit 1
    fi
}

# Function to check if docker-compose exists
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Error: docker-compose is not installed${NC}"
        exit 1
    fi
}

# Function to create .env file if it doesn't exist
ensure_env_file() {
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Creating .env file...${NC}"
        cp server/.env.example .env
        echo -e "${GREEN}Created .env file. Please update it with your configuration.${NC}"
        exit 1
    fi
}

# Main script logic
check_docker
check_docker_compose
ensure_env_file

case "$1" in
    start)
        echo -e "${GREEN}Starting services...${NC}"
        docker-compose up -d
        echo -e "${GREEN}Services started successfully!${NC}"
        echo -e "Frontend: ${YELLOW}http://localhost${NC}"
        echo -e "Backend:  ${YELLOW}http://localhost:5001${NC}"
        ;;
    
    stop)
        echo -e "${YELLOW}Stopping services...${NC}"
        docker-compose down
        echo -e "${GREEN}Services stopped successfully!${NC}"
        ;;
    
    restart)
        echo -e "${YELLOW}Restarting services...${NC}"
        docker-compose down
        docker-compose up -d
        echo -e "${GREEN}Services restarted successfully!${NC}"
        ;;
    
    build)
        echo -e "${YELLOW}Rebuilding services...${NC}"
        docker-compose build --no-cache
        docker-compose up -d
        echo -e "${GREEN}Services rebuilt successfully!${NC}"
        ;;
    
    logs)
        docker-compose logs -f
        ;;
    
    ps)
        docker-compose ps
        ;;
    
    clean)
        echo -e "${YELLOW}Removing all containers and volumes...${NC}"
        docker-compose down -v
        echo -e "${GREEN}Cleanup completed successfully!${NC}"
        ;;
    
    db-reset)
        echo -e "${YELLOW}Resetting database...${NC}"
        docker-compose down
        docker volume rm analytics-dashboard_postgres_data
        docker-compose up -d
        echo -e "${GREEN}Database reset successfully!${NC}"
        ;;
    
    help)
        show_usage
        ;;
    
    *)
        show_usage
        exit 1
        ;;
esac

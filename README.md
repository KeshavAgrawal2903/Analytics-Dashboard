# Analytics Dashboard

A modern analytics dashboard built with React, Node.js, and PostgreSQL, featuring real-time data visualization, order management, and comprehensive analytics.

## 🌟 Features

- 📊 Real-time analytics visualization
- 📦 Order management system
- 📈 Revenue tracking by state
- 🌍 Multi-currency support (Default: INR)
- 🔐 Secure authentication system
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🐳 Docker support for easy deployment

## 🚀 Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd analytics-dashboard
```

2. Make the Docker script executable:
```bash
chmod +x docker.sh
```

3. Start the application:
```bash
./docker.sh start
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5001

### Manual Setup

1. Make the startup script executable:
```bash
chmod +x start.sh
```

2. Run the startup script:
```bash
./start.sh
```

## 🛠️ Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v12 or higher)
- Docker and Docker Compose (for Docker setup)

### Environment Variables

Copy the example environment file:
```bash
cp server/.env.example server/.env
```

Update the following variables in `server/.env`:
```env
PORT=5001
JWT_SECRET=your_jwt_secret_key
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=analytics_dashboard
```

### Available Scripts

#### Docker Environment
```bash
./docker.sh start    # Start all services
./docker.sh stop     # Stop all services
./docker.sh restart  # Restart all services
./docker.sh build    # Rebuild all services
./docker.sh logs     # Show logs
./docker.sh ps       # Show running services
./docker.sh clean    # Remove all containers and volumes
./docker.sh db-reset # Reset the database
```

#### Development Environment
```bash
./start.sh          # Start both client and server
npm run dev         # Start development server
npm run build       # Build for production
npm run test        # Run tests
```

## 📁 Project Structure

```
analytics-dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # State management
│   │   └── utils/        # Utility functions
│   ├── public/           # Static files
│   └── Dockerfile        # Client Docker configuration
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── database/         # Database schemas and migrations
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   └── Dockerfile        # Server Docker configuration
├── docker-compose.yml    # Docker composition
├── start.sh             # Local startup script
└── docker.sh           # Docker management script
```

## 🔄 Database Migrations

Create a new migration:
```bash
cd server
node database/migrate.js create add-new-table
```

Run migrations:
```bash
node database/migrate.js up
```

## 🧪 Testing

Run server tests:
```bash
cd server
npm test
```

Run client tests:
```bash
cd client
npm test
```

## 📦 Deployment

### Using Docker (Production)

1. Build the images:
```bash
./docker.sh build
```

2. Start the services:
```bash
./docker.sh start
```

### Manual Deployment

1. Build the client:
```bash
cd client
npm run build
```

2. Start the server:
```bash
cd server
NODE_ENV=production npm start
```

## 🔒 Security

- JWT authentication
- Rate limiting
- CORS protection
- SQL injection prevention
- XSS protection
- Security headers
- Input validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Docker Issues

1. If containers fail to start:
```bash
./docker.sh logs
```

2. Reset the environment:
```bash
./docker.sh clean
./docker.sh start
```

### Database Issues

1. Reset the database:
```bash
./docker.sh db-reset
```

2. Check database logs:
```bash
docker-compose logs db
```

### Common Issues

1. Port conflicts:
   - Ensure ports 80, 5001, and 5432 are available
   - Change ports in docker-compose.yml if needed

2. Permission issues:
   - Ensure scripts are executable: `chmod +x *.sh`
   - Run with sudo if needed (Docker commands)

3. Database connection fails:
   - Check PostgreSQL credentials in .env
   - Ensure database service is running

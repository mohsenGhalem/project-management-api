# RANWIP Project Management API

A comprehensive NestJS backend application for project management built with TypeScript, PostgreSQL, and TypeORM.

## 🚀 Features

- **User Management**: Complete user CRUD operations with roles and departments
- **Project Management**: Create and manage projects with teams and milestones
- **Task Management**: Full task lifecycle with assignments, comments, and time tracking
- **Team Management**: Organize users into teams with leads and projects
- **Time Tracking**: Log work hours and track project progress
- **Comments System**: Threaded comments with mentions and reactions
- **Analytics**: Project metrics and team productivity insights
- **RESTful API**: Well-documented API endpoints with Swagger
- **Database Relations**: Properly structured PostgreSQL database with TypeORM

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class Validator & Class Transformer
- **Container**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 15+ (or use Docker)
- npm or yarn

## 🏃‍♂️ Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone and setup**:
```bash
git clone <repository-url>
cd ranwip-project-management-api
cp .env.example .env
```

2. **Start with Docker**:
```bash
docker-compose up -d
```

3. **Access the application**:
- API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api
- pgAdmin: http://localhost:5050 (admin@ranwip.com / admin123)

### Option 2: Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Setup PostgreSQL database**:
```sql
CREATE DATABASE ranwip_project_management;
```

3. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Run the application**:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 🗄️ Database Schema

The application includes the following main entities:

### Core Entities
- **Users**: Team members with roles, departments, and skills
- **Projects**: Main project container with teams and milestones
- **Tasks**: Individual work items with assignments and dependencies
- **Teams**: Organized groups of users by department

### Supporting Entities
- **Comments**: Threaded discussions on tasks
- **TimeEntries**: Work time logging and tracking
- **Sprints**: Agile sprint management
- **Analytics**: Project metrics and reporting
- **Notifications**: System notifications for users
- **Media**: File attachments and uploads
- **ProjectTemplates**: Reusable project templates
- **Activities**: Audit trail of system activities

## 🔧 Development

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Operations
```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📊 API Endpoints Overview

### Users
- `GET /users` - List all users
- `POST /users` - Create new user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project by ID
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `POST /projects/:id/team/:userId` - Add team member
- `DELETE /projects/:id/team/:userId` - Remove team member

### Tasks
- `GET /tasks` - List all tasks
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get task by ID
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/logged-hours` - Update logged hours

### Teams
- `GET /teams` - List all teams
- `POST /teams` - Create new team
- `GET /teams/:id` - Get team by ID
- `PATCH /teams/:id` - Update team
- `DELETE /teams/:id` - Delete team

### Comments
- `GET /comments` - List comments
- `POST /comments` - Create new comment
- `GET /comments/:id` - Get comment by ID
- `PATCH /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

## 🔒 Security Features

- Input validation with class-validator
- SQL injection protection via TypeORM
- CORS configuration for frontend integration
- Environment variable configuration
- Error handling and logging

## 🏗️ Project Structure

```
src/
├── users/              # User management module
├── projects/           # Project management module
├── tasks/              # Task management module
├── teams/              # Team management module
├── comments/           # Comments system module
├── time-entries/       # Time tracking module
├── sprints/            # Sprint management module
├── analytics/          # Analytics and reporting
├── notifications/      # Notification system
├── media/              # File upload and media
├── project-templates/  # Project templates
├── activities/         # Activity logging
├── database/           # Database configuration
├── app.module.ts       # Main application module
└── main.ts            # Application entry point
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Environment Variables for Production
```bash
DATABASE_HOST=your-production-db-host
DATABASE_PORT=5432
DATABASE_USERNAME=your-db-user
DATABASE_PASSWORD=your-secure-password
DATABASE_NAME=ranwip_project_management
NODE_ENV=production
JWT_SECRET=your-jwt-secret-key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please contact the RANWIP development team or create an issue in the repository.

---

**RANWIP LLC** - We elevate your online presence 🚀
# Giki

The next generation AI-powered wiki platform with  multi language and Web3  features.
## Features

- Create and edit wiki pages with Markdown
- Image upload and display
- Page versioning
- Web3 wallet authentication
- Change history
- Page search
- AI-powered content translation
- Git repository integration

## 🐳 Docker Environment Management

### Basic Commands

```bash
# Complete stop of all containers (dev + prod)
./docker.sh all down

# Parallel launch of all environments
./docker.sh dev up
./docker.sh prod up

# Log monitoring (development mode)
./docker.sh dev logs

# Emergency restart
./docker.sh all restart
```

### Building Images

```bash
# Building with dependency caching (recommended)
./docker.sh build

# Complete rebuild with cache clearing
./docker.sh build --no-cache

# Building only the production environment
./docker.sh build prod
```

### Working with the Database

```bash
# Create data dump
./docker.sh db dump

# Restore from backup.sql
./docker.sh db restore backup.sql

# PostgreSQL console
./docker.sh db shell
```

## Running the Project

### Using Docker

```bash
# Run in development mode
docker-compose -f docker-compose.yml up -d

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Local Run

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build the project
pnpm run build

# Run the production version
pnpm run start
```

## Testing

The project has a comprehensive set of tests to verify all system components:

### Running Tests Locally

```bash
# All tests
pnpm run test

# Unit tests
pnpm run test:unit

# Integration tests
pnpm run test:integration

# E2E tests with Playwright
pnpm run test:e2e

# E2E tests in interactive mode
pnpm run test:e2e:ui

# E2E tests in debug mode
pnpm run test:e2e:debug

# Tests with coverage report
pnpm run test:coverage
```

### Running Tests in Docker

To run all tests in an isolated Docker environment:

```bash
# Run all tests in Docker
pnpm run test:docker

# Or using the script
./scripts/run-tests.sh
```

## Test Structure

- **Unit tests** (`__tests__/unit/`): Test individual components in isolation
  - `components/`: Tests for React components
  - `api/`: Tests for API endpoints
  - `lib/`: Tests for utility functions

- **Integration tests** (`__tests__/integration/`): Test component interactions
  - `api/`: Tests for API with a real database
  - `auth/`: Tests for authentication

- **E2E tests** (`__tests__/e2e/`): Test the full application functionality
  - Testing user scenarios
  - Authentication verification
  - Page creation and editing verification

## Technical Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- PostgreSQL
- Docker
- Tailwind CSS
- shadcn/ui + Radix UI
- Ethers.js for Web3
- Drizzle ORM
- Jest/Vitest for testing
- Playwright for E2E tests

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Clone the repository
3. Create a `.env` file with the required environment variables
4. Run the following commands:

```bash
# Build and start the containers
docker-compose up -d

# Check the logs
docker-compose logs -f
```

The application will be available at http://localhost:3000

### Option 2: Manual Installation

1. Make sure you have Node.js 20.x and PostgreSQL installed
2. Clone the repository
3. Create a `.env` file with the required environment variables
4. Run the following commands:

```bash
# Install dependencies
pnpm install

# Create database tables
psql -U postgres -d giki -f init-db/01-schema.sql
psql -U postgres -d giki -f init-db/02-seed.sql

# Build the application
pnpm run build

# Start the server
pnpm start
```

## 🧩 Key Features

- **🔐 Web3 Authentication**: Secure login with crypto wallets
- **📝 Markdown Editor**: Rich WYSIWYG editor with Markdown support
- **🌎 AI-Powered Translation**: Translate content to multiple languages with one click
- **📜 Version History**: Track changes and restore previous versions
- **🔄 GitHub Sync**: Automatically backup content to GitHub
- **📱 Responsive Design**: Works on desktop and mobile devices
- **👮 Role-Based Access**: Admin, editor, and viewer roles
- **🐳 Docker Support**: Easy deployment with Docker Compose

## 📊 Project Status

- **Current Stage**: Alpha
- **Progress on Key Tasks**: [7/15]
- **Details**: [TASKS.md](./TASKS.md) and [ROADMAP.md](./ROADMAP.md)

## 📚 Documentation

### Overview and Setup
- [Project Architecture](./ARCHITECTURE.md)
- [Developer Guide](./DEVELOPMENT.md)
- [Deployment Guide](./docs/DEPLOY.md)

### Development
- [Contributing Guide](./CONTRIBUTING.md)
- [Testing](./docs/TESTING.md)
- [API Documentation](./docs/API.md)

### Project Modules
- [App Modules](./app/README.md)
- [Components](./components/README.md)
- [Hooks](./hooks/README.md)
- [Libraries](./lib/README.md)
- [Database](./init-db/README.md)

## 🔧 Technologies

- **Frontend**: React 19, Next.js 15, TailwindCSS 3
- **Backend**: Next.js API Routes, PostgreSQL 15
- **AI**: OpenAI API
- **Authentication**: Web3/Ethers, JWT
- **Deployment**: Docker, Nginx, Certbot

## 👥 Team and Contribution

The project is actively being developed. We welcome contributors! For more information on how to join the development, read [CONTRIBUTING.md](./CONTRIBUTING.md).

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/giki
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=giki

# Authentication
JWT_SECRET=your-secret-key-here-minimum-32-characters-long

# OpenAI (for AI features)
OPENAI_API_KEY=your-openai-api-key

# GitHub (for GitHub sync)
GITHUB_TOKEN=your-github-token
GITHUB_OWNER=your-github-username
GITHUB_REPO=giki-backup

# Server
PORT=3000
```

# Giki.js Roadmap

## Current Version (v0.1.0-alpha)

Core functionality:
- ✅ Web3 authentication
- ✅ Markdown editor
- ✅ Version history
- ✅ Basic search
- ✅ OpenAI integration for translation
- ✅ GitHub synchronization
- ✅ Role-based system

## Version 0.2.0 (Q1 2024)

UX Improvements:
- [ ] Responsive interface for mobile devices
- [ ] Dark theme for all components
- [ ] Enhanced editor with attachment support
- [ ] Improved search with filters
- [ ] Page commenting system
- [ ] Export to PDF and other formats

## Version 0.3.0 (Q2 2024)

Advanced features:
- [ ] Multi-language interface
- [ ] Extended usage analytics
- [ ] Notification system
- [ ] API for external integrations
- [ ] Media content support (video, audio)
- [ ] Advanced access permissions at page level

## Version 0.4.0 (Q3 2024)

Collaborative work:
- [ ] Real-time collaborative editing
- [ ] Task and assignment system
- [ ] User activity history
- [ ] Integrations with external services (Slack, Discord)
- [ ] Review and approval system for changes

## Version 1.0.0 (Q4 2024)

Production version:
- [ ] Scalable architecture for high loads
- [ ] Full test coverage
- [ ] Administration tools
- [ ] Extended documentation
- [ ] Ready-made templates for different content types
- [ ] Integration with popular CMS

## Future Plans

Ideas for consideration:
- Offline mode support with synchronization
- Extended plugin system
- Mobile applications
- Blockchain integration for content verification
- Advanced AI features for content generation and analysis

## Development Priorities

1. 🔴 **High**
   - Stabilization of current features
   - Critical bug fixes
   - Performance improvements

2. 🟠 **Medium**
   - UI/UX improvements
   - Feature expansion
   - Mobile device support

3. 🟢 **Low**
   - Experimental features
   - Optimization for specific use cases

## Progress Measurement

For each version we track:
- Percentage of completed tasks
- Test coverage
- Performance metrics
- User feedback 

## License

MIT

# Giki.js - Next-Generation Wiki Platform

Giki.js is a modern wiki platform with AI-powered translation and Web3 authentication. It provides a seamless experience for creating, editing, and managing wiki content with advanced features like version history, AI-assisted content creation, and GitHub synchronization.

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
npm install

# Create database tables
psql -U postgres -d giki -f init-db/01-schema.sql
psql -U postgres -d giki -f init-db/02-seed.sql

# Build the application
npm run build

# Start the server
npm start
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

## License

MIT

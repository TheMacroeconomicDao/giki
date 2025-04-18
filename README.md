# Giki.js - Next-Generation Wiki Platform

Giki.js is a modern wiki platform with AI-powered translation and Web3 authentication. It provides a seamless experience for creating, editing, and managing wiki content with advanced features like version history, AI-assisted content creation, and GitHub synchronization.

## Features

- **Web3 Authentication**: Secure login with crypto wallets
- **Markdown Editor**: Rich WYSIWYG editor with Markdown support
- **AI-Powered Translation**: Translate content to multiple languages with one click
- **Version History**: Track changes and restore previous versions
- **GitHub Sync**: Automatically backup content to GitHub
- **Responsive Design**: Works on desktop and mobile devices
- **Role-Based Access Control**: Admin, editor, and viewer roles
- **Docker Support**: Easy deployment with Docker Compose

## Prerequisites

- Node.js 20.x or Docker
- PostgreSQL database or Docker
- OpenAI API key (for AI features)
- GitHub token (for GitHub sync)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

\`\`\`env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/giki
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=giki



# OpenAI (for AI features)
OPENAI_API_KEY=your-openai-api-key

# GitHub (for GitHub sync)
GITHUB_TOKEN=your-github-token
GITHUB_OWNER=your-github-username
GITHUB_REPO=giki-backup

# Server
PORT=3000
\`\`\`

## Deployment Options

### Option 1: Docker Compose (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Clone the repository
3. Create a `.env` file with the required environment variables
4. Run the following commands:

\`\`\`bash
# Build and start the containers
docker-compose up -d

# Check the logs
docker-compose logs -f
\`\`\`

The application will be available at http://localhost:3000

### Option 2: Manual Installation

1. Make sure you have Node.js 20.x and PostgreSQL installed
2. Clone the repository
3. Create a `.env` file with the required environment variables
4. Run the following commands:

\`\`\`bash
# Install dependencies
npm install

# Create database tables
psql -U postgres -d giki -f init-db/01-schema.sql
psql -U postgres -d giki -f init-db/02-seed.sql

# Build the application
npm run build

# Start the server
npm start
\`\`\`

The application will be available at http://localhost:3000

## Production Deployment

For production deployment, we recommend using Docker Compose with HTTPS:

1. Update the `nginx/conf/default.conf` file with your domain name
2. Set up DNS records to point your domain to your server
3. Run the following commands:

\`\`\`bash
# Start the containers
docker-compose up -d

# Initialize SSL certificates
docker-compose exec certbot certbot --nginx -d yourdomain.com -d www.yourdomain.com
\`\`\`

## Initial Setup

After deployment, follow these steps:

1. Access the application at http://localhost:3000 or your domain
2. Connect your wallet to create an admin account (the first account will be an admin)
3. Go to Admin > Settings to configure the application
4. Set up OpenAI API key and GitHub token if you want to use those features

## Development

To run the application in development mode:

\`\`\`bash
npm install
npm run dev
\`\`\`

## Testing

To run tests:

\`\`\`bash
npm test
\`\`\`

## License

AGPL
\`\`\`

Let's create a sample `.env` file:

# Giki.js Developer Guide

## 🛠 Environment Setup

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 15 or higher
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/giki.git
   cd giki
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the required variables as described in README.md.

4. **Initialize the database**
   ```bash
   # Start PostgreSQL if not already running
   
   # Create the database
   createdb giki
   
   # Run initialization scripts
   psql -d giki -f init-db/01-schema.sql
   psql -d giki -f init-db/02-seed.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000

## 🏗 Project Structure

```
giki/
├── app/                  # Next.js pages and API routes
│   ├── api/              # Backend API endpoints
│   └── (routes)/         # Frontend page routes
├── components/           # React components
│   ├── ui/               # UI components (buttons, inputs, etc.)
│   └── (feature)/        # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and services
├── init-db/              # Database initialization scripts
├── public/               # Static assets
├── styles/               # Global styles
├── cypress/              # E2E tests
└── nginx/                # Nginx configuration for production
```

## 🧪 Testing

### Running Tests

```bash
# Run unit and integration tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run cypress:open
```

### Writing Tests

- **Unit Tests**: Place them near the code they test with `.test.ts` or `.test.tsx` extension
- **Integration Tests**: Place in the `__tests__` directory
- **E2E Tests**: Place in the `cypress/e2e` directory

## 📦 Build and Deployment

### Production Build

```bash
# Create a production build
npm run build

# Start the production server
npm start
```

### Docker Deployment

```bash
# Build and start containers
docker-compose up -d

# Check logs
docker-compose logs -f
```

### GitHub Sync Configuration

To enable GitHub synchronization:

1. Create a GitHub token with repo permissions
2. Set the following environment variables:
   - `GITHUB_TOKEN`: Your GitHub token
   - `GITHUB_OWNER`: Your GitHub username or organization
   - `GITHUB_REPO`: Repository name for wiki content synchronization

## 🔄 Development Workflow

### Feature Development Process

1. **Create a branch** for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop and test** your changes
   - Follow code style guidelines (see CONTRIBUTING.md)
   - Write tests for your code
   - Update documentation as needed

3. **Commit your changes** with meaningful messages
   ```bash
   git commit -m "feat: add new feature"
   ```

4. **Push your branch** to GitHub
   ```bash
   git push -u origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

### Code Quality Checks

Run these before submitting a PR:

```bash
# Lint code
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

## 🌐 API Development

### Adding a New API Endpoint

1. Create a new directory in `app/api/`
2. Create a `route.ts` file with handler functions
3. Implement the appropriate HTTP methods (GET, POST, etc.)
4. Use service functions from `lib/` for database operations

Example:

```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server';
import { someServiceFunction } from '@/lib/some-service';

export async function GET(request: Request) {
  try {
    const data = await someServiceFunction();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 });
  }
}
```

## 📚 Working with the Database

### Creating Migrations

1. Create a new SQL file in the `init-db` directory with sequential numbering
2. Write your SQL statements
3. Update the schema documentation in `init-db/README.md`

### Database Operations

Use the helper functions in `lib/db.ts` for database operations:

```typescript
import { query, queryOne } from '@/lib/db';

// Query multiple rows
const pages = await query('SELECT * FROM pages WHERE visibility = $1', ['public']);

// Query single row
const user = await queryOne('SELECT * FROM users WHERE id = $1', [userId]);
```

## 🧰 Useful Commands

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm start

# Clear Next.js cache
rm -rf .next
```

## 📝 Coding Standards

- Use TypeScript for all new code
- Follow the existing codebase style
- Write meaningful comments for complex logic
- Create small, focused components and functions
- Use React hooks for state management
- Follow the commit message convention:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for code style changes
  - `refactor:` for code refactoring
  - `test:` for adding or updating tests
  - `chore:` for maintenance tasks 
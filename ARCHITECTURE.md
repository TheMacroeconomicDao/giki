# Giki.js Architecture

## High-Level Diagram

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   Web Interface  |---->|  Next.js API     |---->|   PostgreSQL     |
|  (React + Next)  |<----|  (Backend)       |<----|    Database      |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        |                        |                        |
        v                        v                        v
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   Web3 Auth      |     |   OpenAI API     |     |   GitHub API     |
|   (Ethers)       |     |   (Translation)  |     |  (Synchronization)|
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
```

## Core Modules

### Frontend

- **app/**: Next.js pages and application components
- **components/**: Reusable React components
- **hooks/**: React hooks for state and behavior
- **styles/**: Global styles and Tailwind configuration

### Backend

- **app/api/**: API routes for handling requests
- **lib/**: Service functions and utilities
- **init-db/**: SQL scripts for database initialization

### Infrastructure

- **Dockerfile**: Configuration for building Docker image
- **docker-compose.yml**: Container orchestration
- **nginx/**: Nginx configuration for production deployment

## Database

### ER Diagram

```
+-------------+       +----------------+       +-------------+
|             |       |                |       |             |
|    users    |------>| user_preferences|      |    pages    |
|             |       |                |       |             |
+-------------+       +----------------+       +-------------+
      ^                                              |
      |                                              |
      |                                              v
+-------------+       +----------------+       +-------------+
|             |       |                |       |             |
|   sessions  |       |    settings    |       |page_versions|
|             |       |                |       |             |
+-------------+       +----------------+       +-------------+
                                                     |
                                                     |
                                                     v
                                               +-------------+
                                               |             |
                                               |translated_  |
                                               |  content    |
                                               +-------------+
```

### Main Tables

- **users**: Users with roles and profiles
- **user_preferences**: User settings
- **pages**: Wiki pages with metadata
- **page_versions**: Page version history
- **translated_content**: Translated content
- **sessions**: User sessions
- **settings**: Global settings

## Data Flows

### Page Creation and Editing

1. User authenticates via Web3 (components/web3-provider.tsx)
2. JWT token is stored and used for requests (lib/jwt.ts)
3. User creates/edits page (components/markdown-editor.tsx)
4. Data is sent to API (app/api/pages)
5. Server saves page and version (lib/page-service.ts)
6. Updated data is returned to client

### AI Translation

1. User requests translation (app/api/translate)
2. Server requests translation from OpenAI API (lib/openai.ts)
3. Translated content is saved in database
4. Translated version is returned to user

### GitHub Synchronization

1. Scheduled task (or manual trigger) activates synchronization
2. Server retrieves latest pages from database
3. Content is formatted as Markdown
4. Data is sent to GitHub repository via API (lib/github.ts)

## Authentication and Authorization

- Web3 authentication via message signing (lib/web3.ts)
- JWT token generation for sessions (lib/jwt.ts)
- Role-based access model (admin, editor, viewer)
- Middleware for API route protection (middleware.ts)

## System Extension

### Adding a New API Endpoint

1. Create a new directory in app/api/
2. Implement request handlers (route.ts)
3. Use service functions from lib/
4. Add tests and update documentation

### Adding a New UI Component

1. Create component in components/
2. Use existing UI components from components/ui/
3. Integrate with hooks from hooks/
4. Add to appropriate page in app/ 
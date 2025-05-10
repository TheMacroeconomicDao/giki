# Giki.js App Directory

This directory contains the Next.js application files for Giki.js, organized according to the App Router pattern.

## Directory Structure

```
app/
├── _init.ts                # Application initialization code
├── api/                    # API routes
│   ├── admin/              # Admin-specific endpoints
│   ├── auth/               # Authentication endpoints
│   ├── pages/              # Wiki page endpoints
│   ├── settings/           # Settings endpoints
│   ├── translate/          # Translation endpoints
│   └── users/              # User management endpoints
├── globals.css             # Global CSS styles
├── layout.tsx              # Root layout component
├── page.tsx                # Home page
├── admin/                  # Admin pages
├── create/                 # Page creation interface
├── dashboard/              # User dashboard
├── pages/                  # Wiki pages interface
│   └── [id]/               # Individual page view
├── search/                 # Search interface
└── settings/               # User settings
```

## Key Components

### Layouts and Pages

- **layout.tsx**: The root layout that wraps all pages. It includes global providers like:
  - `ThemeProvider`: For dark/light theme support
  - `Web3Provider`: For Web3 authentication
  - `AuthProvider`: For managing authentication state
  - `ErrorBoundary`: For catching and handling errors

- **page.tsx**: The home page of the application, showing recent and popular pages

### API Routes

API endpoints follow the Next.js 13+ route handlers pattern:

```typescript
// Example API route in app/api/pages/route.ts
import { NextResponse } from 'next/server';
import { getAllPages } from '@/lib/page-service';

export async function GET(request: Request) {
  try {
    const pages = await getAllPages();
    return NextResponse.json({ pages });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}
```

## App Initialization

The `_init.ts` file initializes the application by:
1. Checking database connectivity
2. Loading application settings
3. Setting up logging

## Route Groups

- **admin/**: Admin-only pages for managing users, settings, and content
- **create/**: Interface for creating new wiki pages
- **dashboard/**: User's personal dashboard with activity and pages
- **pages/**: Main wiki page viewing and editing interfaces
- **search/**: Search functionality for finding content
- **settings/**: User profile and preference settings

## API Organization

API routes are organized by feature:

- **api/admin/**: Admin-specific operations
- **api/auth/**: Authentication (login, logout, refresh)
- **api/pages/**: Wiki page operations (CRUD)
- **api/settings/**: Application settings management
- **api/translate/**: Content translation endpoints
- **api/users/**: User management

## Adding New Routes

To add a new page:

1. Create a new directory in the appropriate section
2. Add a `page.tsx` file with the React component
3. If needed, add a `layout.tsx` file for page-specific layouts

Example:

```typescript
// app/dashboard/activity/page.tsx
export default function ActivityPage() {
  return (
    <div>
      <h1>Activity Feed</h1>
      {/* Page content */}
    </div>
  );
}
```

## Adding New API Endpoints

To add a new API endpoint:

1. Create a new directory in `app/api/`
2. Add a `route.ts` file with the appropriate HTTP methods
3. Implement the endpoint logic using Next.js Response objects

Example:

```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Example endpoint' });
}

export async function POST(request: Request) {
  const data = await request.json();
  // Process data
  return NextResponse.json({ received: data });
}
```

## Authentication and Authorization

- Authentication is handled by the `middleware.ts` file at the project root
- Protected routes check for valid JWT tokens
- Role-based access control is implemented for admin routes

## CSS and Styling

- Global styles are defined in `globals.css`
- The application uses Tailwind CSS for styling
- Component-specific styles are included directly in the components 
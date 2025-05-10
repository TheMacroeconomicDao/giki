# Giki.js API Documentation

This document provides information about the Giki.js API endpoints, request/response formats, and authentication requirements.

## 🔐 Authentication

Most API endpoints require authentication via JWT token.

### Headers

Include the following header in your authenticated requests:

```
Authorization: Bearer <jwt_token>
```

To obtain a JWT token, use the authentication endpoints described below.

## 📡 API Endpoints

### Authentication

#### Web3 Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "address": "0x...",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_id",
    "address": "0x...",
    "name": "User Name",
    "role": "admin|editor|viewer"
  }
}
```

#### Refresh Token

```
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "token": "new_jwt_token_here"
}
```

#### Logout

```
POST /api/auth/logout
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true
}
```

### Pages

#### Get All Pages

```
GET /api/pages
```

**Query Parameters:**
- `limit` (optional): Number of pages to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)
- `visibility` (optional): Filter by visibility (public, private)

**Response:**
```json
{
  "pages": [
    {
      "id": "page_id",
      "title": "Page Title",
      "content": "Page content in Markdown",
      "visibility": "public",
      "author": {
        "id": "user_id",
        "name": "Author Name"
      },
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-02T00:00:00Z"
    }
  ],
  "total": 100
}
```

#### Get Page by ID

```
GET /api/pages/:id
```

**Response:**
```json
{
  "id": "page_id",
  "title": "Page Title",
  "content": "Page content in Markdown",
  "visibility": "public",
  "author": {
    "id": "user_id",
    "name": "Author Name"
  },
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-02T00:00:00Z",
  "versions": [
    {
      "id": "version_id",
      "createdAt": "2023-01-01T00:00:00Z",
      "createdBy": {
        "id": "user_id",
        "name": "Editor Name"
      }
    }
  ]
}
```

#### Create Page

```
POST /api/pages
```

**Request Body:**
```json
{
  "title": "New Page Title",
  "content": "Page content in Markdown",
  "visibility": "public"
}
```

**Response:**
```json
{
  "id": "new_page_id",
  "title": "New Page Title",
  "content": "Page content in Markdown",
  "visibility": "public",
  "author": {
    "id": "user_id",
    "name": "Author Name"
  },
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Update Page

```
PUT /api/pages/:id
```

**Request Body:**
```json
{
  "title": "Updated Page Title",
  "content": "Updated page content in Markdown",
  "visibility": "public"
}
```

**Response:**
```json
{
  "id": "page_id",
  "title": "Updated Page Title",
  "content": "Updated page content in Markdown",
  "visibility": "public",
  "author": {
    "id": "user_id",
    "name": "Author Name"
  },
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-02T00:00:00Z"
}
```

#### Delete Page

```
DELETE /api/pages/:id
```

**Response:**
```json
{
  "success": true
}
```

### Versions

#### Get Page Version

```
GET /api/pages/:id/versions/:versionId
```

**Response:**
```json
{
  "id": "version_id",
  "pageId": "page_id",
  "content": "Page content at this version",
  "createdAt": "2023-01-01T00:00:00Z",
  "createdBy": {
    "id": "user_id",
    "name": "Editor Name"
  }
}
```

#### Restore Page Version

```
POST /api/pages/:id/versions/:versionId/restore
```

**Response:**
```json
{
  "id": "page_id",
  "title": "Page Title",
  "content": "Restored page content",
  "visibility": "public",
  "author": {
    "id": "user_id",
    "name": "Author Name"
  },
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-03T00:00:00Z"
}
```

### Translation

#### Translate Page

```
POST /api/translate
```

**Request Body:**
```json
{
  "pageId": "page_id",
  "targetLanguage": "fr"
}
```

**Response:**
```json
{
  "id": "translation_id",
  "pageId": "page_id",
  "language": "fr",
  "content": "Translated content in French",
  "createdAt": "2023-01-03T00:00:00Z"
}
```

#### Get Translation

```
GET /api/pages/:id/translations/:language
```

**Response:**
```json
{
  "id": "translation_id",
  "pageId": "page_id",
  "language": "fr",
  "content": "Translated content in French",
  "createdAt": "2023-01-03T00:00:00Z",
  "updatedAt": "2023-01-03T00:00:00Z"
}
```

### Users

#### Get User Profile

```
GET /api/users/me
```

**Response:**
```json
{
  "id": "user_id",
  "address": "0x...",
  "name": "User Name",
  "email": "user@example.com",
  "role": "admin",
  "avatarUrl": "https://...",
  "createdAt": "2023-01-01T00:00:00Z",
  "lastLogin": "2023-01-03T00:00:00Z",
  "preferences": {
    "language": "en",
    "theme": "dark",
    "emailNotifications": true
  }
}
```

#### Update User Profile

```
PUT /api/users/me
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "new@example.com",
  "preferences": {
    "language": "fr",
    "theme": "light",
    "emailNotifications": false
  }
}
```

**Response:**
```json
{
  "id": "user_id",
  "address": "0x...",
  "name": "Updated Name",
  "email": "new@example.com",
  "role": "admin",
  "avatarUrl": "https://...",
  "preferences": {
    "language": "fr",
    "theme": "light",
    "emailNotifications": false
  }
}
```

### Admin

#### Get All Users (Admin only)

```
GET /api/admin/users
```

**Query Parameters:**
- `limit` (optional): Number of users to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)
- `role` (optional): Filter by role

**Response:**
```json
{
  "users": [
    {
      "id": "user_id",
      "address": "0x...",
      "name": "User Name",
      "email": "user@example.com",
      "role": "admin|editor|viewer",
      "createdAt": "2023-01-01T00:00:00Z",
      "lastLogin": "2023-01-03T00:00:00Z"
    }
  ],
  "total": 50
}
```

#### Update User Role (Admin only)

```
PUT /api/admin/users/:id/role
```

**Request Body:**
```json
{
  "role": "editor"
}
```

**Response:**
```json
{
  "id": "user_id",
  "address": "0x...",
  "name": "User Name",
  "role": "editor",
  "updatedAt": "2023-01-03T00:00:00Z"
}
```

### Settings

#### Get Settings

```
GET /api/settings
```

**Response:**
```json
{
  "settings": {
    "siteName": "Giki Wiki",
    "siteDescription": "A next-generation wiki platform",
    "defaultLanguage": "en",
    "enableGitHubSync": true,
    "enableOpenAI": true
  }
}
```

#### Update Settings (Admin only)

```
PUT /api/settings
```

**Request Body:**
```json
{
  "siteName": "Updated Site Name",
  "siteDescription": "Updated description",
  "defaultLanguage": "en",
  "enableGitHubSync": true,
  "enableOpenAI": true
}
```

**Response:**
```json
{
  "settings": {
    "siteName": "Updated Site Name",
    "siteDescription": "Updated description",
    "defaultLanguage": "en",
    "enableGitHubSync": true,
    "enableOpenAI": true
  }
}
```

## 📊 Response Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## 🔄 Error Response Format

All API errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## 📚 API Rate Limits

The API has the following rate limits:

- **Authentication endpoints**: 10 requests per minute
- **Other endpoints**: 100 requests per minute

When a rate limit is exceeded, the API will return a `429 Too Many Requests` status code.

## 🧪 Test Environment

For development and testing, you can use our test environment:

```
https://test-api.giki.example.com
```

The test environment includes sample data and has higher rate limits.

## 📄 OpenAPI Specification

The full OpenAPI specification is available at:

```
/api/openapi.json
```

You can use this specification with tools like Swagger UI or Postman to explore the API.

## 🔄 GitHub Synchronization

### Trigger GitHub Sync (Admin only)

```
POST /api/github/sync
```

**Response:**
```json
{
  "success": true,
  "message": "GitHub synchronization started"
}
```

### Get GitHub Sync Status (Admin only)

```
GET /api/github/sync/status
```

**Response:**
```json
{
  "status": "running|completed|failed",
  "lastSync": "2023-01-03T00:00:00Z",
  "message": "Optional status message"
}
``` 
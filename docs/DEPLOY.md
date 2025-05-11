# Giki.js Deployment Guide

This guide provides detailed instructions for deploying Giki.js in various environments.

## Prerequisites

Before deploying Giki.js, ensure you have:

- A PostgreSQL database (version 15 or higher)
- Node.js 20.x (for manual deployments)
- Docker and Docker Compose (for containerized deployments)
- A domain name (for production deployments)
- SSL certificate (for production deployments)
- OpenAI API key (for AI-powered features)
- GitHub token (for GitHub synchronization)

## Deployment Options

Giki.js offers several deployment options to fit your needs:

### 1. Docker Compose Deployment (Recommended)

The easiest way to deploy Giki.js is using Docker Compose.

#### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/giki.git
cd giki
```

#### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/giki
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=giki

# Authentication
JWT_SECRET=your-secure-random-string-minimum-32-characters

# OpenAI (for AI features)
OPENAI_API_KEY=your-openai-api-key

# GitHub (for GitHub sync)
GITHUB_TOKEN=your-github-token
GITHUB_OWNER=your-github-username
GITHUB_REPO=giki-backup

# Server
PORT=3000
```

#### Step 3: Start Docker Containers

```bash
docker-compose up -d
```

This will start:
- A PostgreSQL database container
- The Giki.js application container
- An Nginx container for reverse proxy
- A Certbot container for SSL certificates

#### Step 4: Verify Deployment

Access your Giki instance at http://localhost:3000

### 2. Manual Deployment

#### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/giki.git
cd giki
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Set Up the Database

Ensure PostgreSQL is running, then create the database and tables:

```bash
createdb giki
psql -d giki -f init-db/01-schema.sql
psql -d giki -f init-db/02-seed.sql
```

#### Step 4: Configure Environment Variables

Create a `.env` file in the root directory with the appropriate values (see Docker Compose example above, but use `localhost` for the database host).

#### Step 5: Build and Start the Application

```bash
npm run build
npm start
```

The application will be available at http://localhost:3000

### 3. Production Deployment with HTTPS

For production environments, you should enable HTTPS. Our Docker Compose setup includes Nginx and Certbot for this purpose.

#### Step 1: Update Nginx Configuration

Edit `nginx/conf/default.conf` and replace `yourdomain.com` with your actual domain:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        return 301 https://$host$request_uri;
    }
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Step 2: Set Up DNS Records

Create A records pointing your domain and www subdomain to your server's IP address.

#### Step 3: Start Docker Containers

```bash
docker-compose up -d
```

#### Step 4: Initialize SSL Certificates

```bash
docker-compose exec certbot certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Your application will now be available at https://yourdomain.com

## Scaling for Production

For production environments with higher traffic, consider the following optimizations:

### Database Scaling

1. **Connection Pooling**: Use pgBouncer for efficient connection management
2. **Read Replicas**: Set up PostgreSQL read replicas for read-heavy workloads
3. **Monitoring**: Add monitoring tools like pgHero or pgAdmin

### Application Scaling

1. **Load Balancer**: Set up a load balancer (like NGINX, HAProxy, or a cloud provider's solution)
2. **Multiple Instances**: Run multiple application containers behind the load balancer
3. **Redis Cache**: Add Redis for session storage and caching

Example Docker Compose configuration for scaled deployment:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    networks:
      - giki-network

  db:
    image: postgres:15-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - giki-network

  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data
    networks:
      - giki-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf:/etc/nginx/conf.d
      - ./nginx/certbot/conf:/etc/letsencrypt
    depends_on:
      - app
    networks:
      - giki-network

networks:
  giki-network:

volumes:
  postgres-data:
  redis-data:
```

## Backup and Restore

### Database Backup

Schedule regular backups of your PostgreSQL database:

```bash
# Backup script (store in scripts/backup-db.sh)
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/path/to/backups
FILENAME=${BACKUP_DIR}/giki_db_${TIMESTAMP}.sql.gz

# Create backup
pg_dump -U postgres -d giki | gzip > ${FILENAME}

# Clean up old backups (keep last 10)
ls -t ${BACKUP_DIR}/giki_db_*.sql.gz | tail -n +11 | xargs -r rm
```

Make it executable and add to crontab:

```bash
chmod +x scripts/backup-db.sh
crontab -e
# Add line: 0 2 * * * /path/to/scripts/backup-db.sh
```

### Database Restore

To restore from a backup:

```bash
# If using Docker
cat backup_file.sql.gz | gunzip | docker exec -i giki_db_1 psql -U postgres -d giki

# If using local PostgreSQL
cat backup_file.sql.gz | gunzip | psql -U postgres -d giki
```

## Monitoring and Logging

### Application Logs

Docker Compose logs can be viewed with:

```bash
docker-compose logs -f app
```

For persistent logging, consider integrating with services like ELK Stack, Papertrail, or cloud provider logging solutions.

### Health Checks

The application exposes a health check endpoint at `/api/health` that can be used for monitoring.

Example monitoring script:

```bash
#!/bin/bash
HEALTH_URL=https://yourdomain.com/api/health
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" ${HEALTH_URL})

if [ ${RESPONSE} -ne 200 ]; then
  echo "Giki health check failed with status ${RESPONSE}"
  # Add notification logic here
  exit 1
fi
```

## Troubleshooting

### Database Connection Issues

If the application can't connect to the database:

1. Verify PostgreSQL is running: `docker-compose ps` or `pg_isready`
2. Check the DATABASE_URL environment variable
3. Ensure database initialization completed successfully

### Container Issues

If containers fail to start:

1. Check container logs: `docker-compose logs app`
2. Verify all required environment variables are set
3. Ensure ports are not already in use

### SSL Certificate Issues

If SSL certificates fail to generate:

1. Verify DNS records are correctly set
2. Check Certbot logs: `docker-compose logs certbot`
3. Ensure your domain is accessible from the internet

## Upgrading

To upgrade to a new version of Giki.js:

```bash
# Pull latest changes
git pull

# Rebuild and restart containers
docker-compose down
docker-compose build
docker-compose up -d

# Apply any new database migrations
docker-compose exec app npm run migrate
```

## Security Considerations

- Always change default passwords
- Use a strong, unique JWT_SECRET
- Keep your environment variables secure
- Regularly update dependencies: `npm audit fix`
- Set up firewall rules to limit access to only necessary ports
- Enable rate limiting for API endpoints 
# Development Dockerfile with Node.js
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Only copy package files first to leverage Docker caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the development server
CMD ["pnpm", "run", "dev"] 
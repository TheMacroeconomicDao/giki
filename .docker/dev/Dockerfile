# Development Dockerfile with Bun
FROM oven/bun:latest

# Create app directory
WORKDIR /app

# Only copy package files first to leverage Docker caching
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the development server
CMD ["bun", "run", "dev"] 
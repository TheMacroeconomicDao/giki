#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set in .env file"
  exit 1
fi

# Try to connect to the database
echo "Checking database connection..."
npx -y pg-connection-string check "$DATABASE_URL"

if [ $? -eq 0 ]; then
  echo "Database connection successful!"
else
  echo "Failed to connect to database. Please check your DATABASE_URL."
  exit 1
fi

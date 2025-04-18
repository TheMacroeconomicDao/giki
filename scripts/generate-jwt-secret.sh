#!/bin/bash

# Generate a random 32-character string for JWT_SECRET
SECRET=$(openssl rand -base64 32)

echo "Generated JWT_SECRET:"
echo $SECRET
echo ""
echo "Add this to your .env file:"
echo "JWT_SECRET=$SECRET"

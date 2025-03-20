#!/bin/bash

# Simple script to deploy the NCAA Tournament Slack bot with Docker

# Make sure .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with your credentials first (copy from .env.example)"
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p data

# Pull latest code if in a git repository
if [ -d .git ]; then
    echo "Pulling latest code..."
    git pull
fi

# Build and start the Docker container
echo "Building and starting Docker container..."
docker-compose down
docker-compose up -d --build

# Check if the container is running
if [ "$(docker-compose ps -q ncaa-bot)" ]; then
    echo "NCAA Tournament Slack bot is now running!"
    echo "View logs with: docker-compose logs -f"
    echo "Stop with: docker-compose down"
else
    echo "Error: Container failed to start. Check logs with: docker-compose logs"
    exit 1
fi

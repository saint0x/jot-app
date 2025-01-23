FROM node:18-alpine

WORKDIR /app

# Install SQLite and its dependencies
RUN apk add --no-cache sqlite

# Copy package files
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Create db directory and ensure it's writable
RUN mkdir -p db && chown -R node:node db

# Copy schema file first to ensure it exists
COPY db/schema.sql ./db/
RUN chown node:node db/schema.sql

# Copy environment variables
COPY .env* ./

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Switch to non-root user
USER node

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 
# Stage 1: Build the frontend app
FROM node:18 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the code and build
COPY . .
RUN npm run build

# Stage 2: Serve the built app
FROM node:18-slim

WORKDIR /app

# Install 'serve' globally
RUN npm install -g serve

# Copy build artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the frontend port
EXPOSE 3000

# Start the app using 'serve'
CMD ["serve", "-s", "dist", "-l", "3000"]

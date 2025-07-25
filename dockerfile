# Step 1: Use an official Node.js LTS image
FROM node:18-alpine AS builder

# Step 2: Set working directory
WORKDIR /src

# Step 3: Copy package files and install deps
COPY package*.json ./
RUN npm ci --omit=dev

# Step 4: Copy the rest of your app
COPY . .

# Optional: Build your app (uncomment if needed)
# RUN npm run build

# Step 5: Use a smaller image for the final container (production mode)
FROM node:18-alpine

WORKDIR /app

# Only copy necessary files from builder
COPY --from=builder /src /src

# If you built the app, you could copy just the build:
# COPY --from=builder /app/dist ./dist

# Set NODE_ENV for optimization
ENV NODE_ENV=production

# Expose port (change this if your app uses a different port)
EXPOSE 3000

# Default command
CMD ["node", "index.js"]

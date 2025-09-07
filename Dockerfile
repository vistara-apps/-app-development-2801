# Multi-stage build: Build stage creates dist, Production stage serves it
FROM node:22-alpine AS builder

# Install Python and build tools for native dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
  
RUN npm install --prefer-offline --no-audit

# Copy source code after dependencies are installed
COPY . .

# Build the application with memory optimization
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build


FROM node:22-alpine AS production

# Install serve globally for production
RUN npm install -g serve

WORKDIR /app

# Copy ONLY the built dist directory from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create a startup script to debug environment variables
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'echo "NODE_ENV: $NODE_ENV"' >> /app/start.sh && \
    echo 'echo "PORT: $PORT"' >> /app/start.sh && \
    echo 'echo "EASYPOST_API_KEY exists: $([ -n "$EASYPOST_API_KEY" ] && echo "YES" || echo "NO")"' >> /app/start.sh && \
    echo 'echo "EASYPOST_API_KEY length: ${#EASYPOST_API_KEY}"' >> /app/start.sh && \
    echo 'npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the application with debug info
CMD ["/app/start.sh"]

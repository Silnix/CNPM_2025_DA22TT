# Build stage
FROM node:18-alpine as build

# Tạo user không phải root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY --chown=nodejs:nodejs package*.json ./

# Cài đặt dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY --chown=nodejs:nodejs . .

# Build ứng dụng
RUN npm run build

# Serve stage
FROM nginx:alpine

# Cài đặt wget cho health check
RUN apk add --no-cache wget

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files từ build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Tạo user nginx nếu chưa có
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 -G nginx

# Set quyền cho thư mục
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"] 
# Sử dụng image node chính thức với phiên bản LTS
FROM node:18-alpine

# Tạo user không phải root để tăng bảo mật
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Tạo thư mục app và set quyền
WORKDIR /app
RUN chown -R nodejs:nodejs /app

# Copy package.json và package-lock.json
COPY --chown=nodejs:nodejs package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy toàn bộ mã nguồn
COPY --chown=nodejs:nodejs . .

# Cài đặt wget cho health check
RUN apk add --no-cache wget

# Chuyển sang user nodejs
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Chạy server
CMD ["node", "index.js"] 
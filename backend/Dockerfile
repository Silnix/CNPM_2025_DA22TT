# Sử dụng image node chính thức
FROM node:18-alpine

# Tạo thư mục app
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

# Copy toàn bộ mã nguồn
COPY . .

# Expose port
EXPOSE 5000

# Chạy server
CMD ["node", "index.js"] 
FROM node:18 as build

WORKDIR /app

COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

COPY . .

# สร้างไฟล์ environment
RUN echo "VITE_API_URL=${VITE_API_URL:-http://localhost:5001}" > .env

# แก้ไขปัญหา rollup โดยติดตั้ง dependencies เพิ่มเติม
RUN npm install -D rollup@^3.21.0

RUN npm run build

# Production environment
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# สร้างไฟล์ nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
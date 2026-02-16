# docker/frontend/Dockerfile

# ===== dev stage =====
FROM node:20-alpine AS dev
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
CMD ["npm", "run", "dev"]

# ===== build stage =====
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend .
RUN npm run build

# ===== prod stage =====
FROM nginx:alpine AS prod
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

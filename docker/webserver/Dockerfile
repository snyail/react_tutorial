# docker/webserver/Dockerfile

# ===== dev =====
FROM node:20-alpine AS dev
WORKDIR /app
COPY websocketserver/package*.json ./
RUN npm install
COPY websocketserver .
# ts-node / no demon 想定
CMD ["npm", "run", "dev"]

# ===== build =====
FROM node:20-alpine AS build
WORKDIR /app
COPY websocketserver/package*.json ./
RUN npm ci
COPY websocketserver .
RUN npm run build

# ===== prod =====
FROM node:20-alpine AS prod
WORKDIR /app
COPY websocketserver/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
CMD ["node", "dist/server.js"]

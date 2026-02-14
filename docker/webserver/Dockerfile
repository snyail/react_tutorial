FROM node:20-alpine

WORKDIR /app

COPY websocketserver/package.json websocketserverpackage-lock.json* ./
RUN npm install

COPY websocketserver/tsconfig.json ./
COPY websocketserver/server.ts ./

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/server.js"]

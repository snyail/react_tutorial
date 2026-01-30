FROM node:20-alpine

WORKDIR /app

COPY websocketserver/package.json ./
RUN npm install

EXPOSE 3001

CMD ["node", "server.js"]

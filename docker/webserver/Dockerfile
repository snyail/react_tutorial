FROM node:20-alpine

WORKDIR /app

COPY websocketserver/package.json ./
RUN npm install

COPY websocketserver/server.js ./

EXPOSE 3001
CMD ["npm", "start"]

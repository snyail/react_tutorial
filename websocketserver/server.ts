// server.ts
import { WebSocketServer, WebSocket, RawData } from "ws";

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

const clients: WebSocket[] = [];

console.log(`WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (socket: WebSocket) => {
  console.log("client connected");
  clients.push(socket);

  // 2人揃ったら役割を決定
  if (clients.length === 2) {
    clients[0].send(JSON.stringify({
      type: "role",
      isInitiator: true
    }));
    clients[1].send(JSON.stringify({
      type: "role",
      isInitiator: false
    }));
  }

  socket.on("message", (data : RawData) => {
    // 送信者以外にだけ転送
    clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });

  socket.on("close", () => {
    console.log("client disconnected");
    const index = clients.indexOf(socket);
    if (index !== -1) clients.splice(index, 1);
  });
});

import { WebSocketServer } from "ws";

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (socket) => {
  console.log("client connected");

  socket.on("message", (data) => {
    console.log("received:", data.toString());

    // 全員に送信（ブロードキャスト）
    wss.clients.forEach((client) => {
      if (client.readyState === socket.OPEN) {
        client.send(data.toString());
      }
    });
  });

  socket.on("close", () => {
    console.log("client disconnected");
  });
});

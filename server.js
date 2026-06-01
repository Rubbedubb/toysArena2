const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")));

const wss = new WebSocket.Server({
  server: server,
  path: "/ws"
});

function broadcast(data) {
  const message = JSON.stringify(data);

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(message) {
    let data;

    try {
      data = JSON.parse(message.toString());
    } catch {
      console.log("Invalid JSON");
      return;
    }

    console.log("Received:", data);

    broadcast(data);
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

server.listen(3000, "0.0.0.0", function () {
  console.log("Server running on http://localhost:3000");
});
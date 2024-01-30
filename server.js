const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.set(ws._socket.remoteAddress, ws);

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`${ws._socket.remoteAddress}: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws._socket.remoteAddress);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

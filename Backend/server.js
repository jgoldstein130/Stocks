import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});

wss.on("connection", async (ws) => {
  console.log("Client connected");
  ws.send('Hello from WebSocket!');
});

setInterval(async () => {
  wss.clients.forEach(async client => {
    if (client.readyState === WebSocket.OPEN) {
      const prices = await fetchStockPrices();
      client.send(JSON.stringify(prices));
    }
  });
}, 5000);


const FINNHUB_API_KEY = 'd4q8i49r01quli1b0u0gd4q8i49r01quli1b0u10';
const symbol = 'AAPL'

const fetchStockPrices = async () => {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
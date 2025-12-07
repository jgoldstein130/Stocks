import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
app.use(cors()); // Allow all origins (for development only

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});

wss.on("connection", async (ws) => {
  console.log("Client connected");
  ws.send('Hello from WebSocket!');
});

// setInterval(async () => {
//   wss.clients.forEach(async client => {
//     if (client.readyState === WebSocket.OPEN) {
//       const prices = await fetchStockPrices();
//       client.send(JSON.stringify(prices));
//     }
//   });
// }, 5000);

const FINNHUB_API_KEY = 'd4q8i49r01quli1b0u0gd4q8i49r01quli1b0u10';
const symbol = 'AAPL'
const fetchStockPrices = async () => {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}


const fetchStockData = async (symbol) => {
  try {
    const response = await fetch("https://api.prixe.io/api/price", {
      method: "POST",
      headers: {
        Authorization: "Bearer test_d1da42e366e1644159dcf625f0b21f48f686900cee6963fec8c8c5cf4b879a1c",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticker: symbol,
        start_date: "2025-10-01",
        end_date: "2025-10-02",
        interval: "1h",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // <-- return the JSON data
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null; // return null in case of error
  }
};





app.get('/api/price', async (req, res) => {
  try {
    const { symbol } = req.query;
    const prices = await fetchStockData(symbol);
    res.json(prices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stock prices' });
  }
});
import { useEffect, useState, type ReactNode } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
const FINNHUB_API_KEY = "d4q8i49r01quli1b0u0gd4q8i49r01quli1b0u10";

const Chart = (props: Props) => {
  const [graphData, setGraphData] = useState<any>();
  const [graphDomain, setGraphDomain] = useState<number[]>();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onmessage = (event) => {
      //const data = JSON.parse(event.data);
      console.log(event.data);
    };

    return () => ws.close();
  }, []);

  const fetchStockPrice = async (symbol: string) => {
    const url = `http://localhost:8000/api/price?symbol=${symbol}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  };

  const createGraphData = async () => {
    const prices = await fetchStockPrice(props.selectedStock);
    const highPrices = prices.data.high;
    const lowPrices = prices.data.low;
    const timestamps = prices.data.timestamp;

    const data = [];
    let highestPrice = 0;
    let lowestPrice = 1000000;

    for (let i = 0; i < timestamps.length; i++) {
      const averagePrice = Number(((highPrices[i] + lowPrices[i]) / 2).toFixed(2));
      data.push({ name: timestampToDatetime(timestamps[i]), price: averagePrice });

      if (averagePrice > highestPrice) {
        highestPrice = averagePrice;
      } else if (averagePrice < lowestPrice) {
        lowestPrice = averagePrice;
      }

      const halfwayPrice = (highestPrice + lowestPrice) / 2;
      setGraphDomain([
        Number((lowestPrice - halfwayPrice / 100).toFixed(2)),
        Number((highestPrice + halfwayPrice / 100).toFixed(2)),
      ]);
    }

    setGraphData(data);
  };

  const timestampToDatetime = (ts: number) => {
    return new Date(ts * 1000).getHours();
  };

  useEffect(() => {
    if (props.selectedStock) {
      createGraphData();
    }
  }, [props.selectedStock]);

  return (
    <LineChart
      style={{
        width: "100%",
        maxWidth: "700px",
        height: "100%",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={graphData}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" domain={graphDomain} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="price" stroke="#82ca9d" />
    </LineChart>
  );
};

interface Props {
  childern?: ReactNode;
  selectedStock: string;
}

export default Chart;

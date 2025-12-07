import "./App.css";
import "./index.css";
import StockSearch from "./components/StockSearch/StockSearch";
import Chart from "./components/Chart/Chart";
import { useState } from "react";

const App = () => {
  const [selectedStock, setSelectedStock] = useState<string>("");

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <StockSearch setSelectedStock={(stock: string) => setSelectedStock(stock)} />
      <Chart selectedStock={selectedStock} />
    </div>
  );
};

export default App;

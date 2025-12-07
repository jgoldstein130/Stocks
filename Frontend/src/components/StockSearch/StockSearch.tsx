import { useEffect, useState, type ReactNode } from "react";
import "../../App.css";
import { TextInput, Text } from "@mantine/core";
import { Virtuoso } from "react-virtuoso";
import "../../index.css";

const StockSearch = (props: Props) => {
  const [allStocks, setAllStocks] = useState<any>();
  const [filteredStocks, setFilteredStocks] = useState<any>();
  const [query, setQuery] = useState<string>("");
  const [showStockDropdown, setShowStockDropdown] = useState<boolean>(false);
  const FINNHUB_API_KEY = "d4q8i49r01quli1b0u0gd4q8i49r01quli1b0u10";

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    if (allStocks) {
      setFilteredStocks(allStocks.filter((stock: any) => shouldShowStock(stock)));
    }
  }, [query, allStocks]);

  const fetchStocks = async () => {
    const url = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${FINNHUB_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    setAllStocks(data.sort((a: any, b: any) => a.symbol.localeCompare(b.symbol)));
  };

  const shouldShowStock = (stock: any) => {
    if (
      (query && stock.symbol.toLowerCase().includes(query.toLowerCase())) ||
      stock.description.toLowerCase().includes(query.toLowerCase())
    ) {
      return true;
    }
    return false;
  };

  const selectStock = (symbol: string) => {
    setQuery(symbol);
    props.setSelectedStock(symbol);
  };

  return (
    <>
      <TextInput
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowStockDropdown(true)}
        onBlur={() => setShowStockDropdown(false)}
        value={query}
        placeholder="Search"
        style={{
          width: "300px",
        }}
        styles={{
          input: {
            backgroundColor: "#1e1e1e",
            color: "#e0e0e0",
            border: "1px solid #2f2f2f",

            "::placeholder": {
              color: "#777",
            },
          },
        }}
      />
      {showStockDropdown && filteredStocks && (
        <>
          {filteredStocks.length === 0 && (
            <div>
              <Text size="sm" c="#CCCCCC">
                No Results
              </Text>
            </div>
          )}
          <Virtuoso
            className="no-scrollbar"
            style={{ height: "300px", width: "300px" }}
            totalCount={filteredStocks.length}
            itemContent={(index) => (
              <div
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #2A2A2A",
                  backgroundColor: "#121212", // dark container background
                }}
              >
                <div
                  onMouseDown={() => selectStock(filteredStocks[index].symbol)}
                  style={{
                    padding: "10px",
                    marginBottom: "4px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor: "#1C1C1C", // slightly lighter than outer container
                    border: "1px solid #2E2E2E", // subtle border for structure
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Text size="md" c="#FFFFFF">
                      {filteredStocks[index].symbol}
                    </Text>
                    <Text size="sm" c="#CCCCCC">
                      {filteredStocks[index].description}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          />
        </>
      )}
    </>
  );
};

interface Props {
  childern?: ReactNode;
  setSelectedStock: (stock: string) => void;
}

export default StockSearch;

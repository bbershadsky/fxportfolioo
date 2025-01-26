"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface CryptoDataPoint {
  time: number;
  price: number;
}

export const useEthereumData = () => {
  const [data, setData] = useState<CryptoDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEthereumData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/ethereum/market_chart",
          {
            params: {
              vs_currency: "USD",
              days: "90",
              interval: "daily",
            },
          }
        );

        // Transform the data
        const prices = response.data.prices.map((item: [number, number]) => ({
          time: item[0],
          price: item[1],
        }));

        setData(prices);
      } catch (error) {
        console.error("Error fetching Ethereum data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEthereumData();
  }, []);

  return { data, loading };
};

"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface CryptoDataPoint {
  time: number;
  price: number;
}

export const useCardanoData = () => {
  const [data, setData] = useState<CryptoDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCardanoData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/cardano/market_chart",
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
        console.error("Error fetching Cardano data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardanoData();
  }, []);

  return { data, loading };
};

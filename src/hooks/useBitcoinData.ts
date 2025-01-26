"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface BitcoinDataPoint {
  time: string; // converted to human-readable date
  price: number;
}

// Fetch function for Bitcoin data with timestamp conversion
const fetchBitcoinData = async (): Promise<BitcoinDataPoint[]> => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
    {
      params: {
        vs_currency: "USD",
        days: "90",
        interval: "daily",
      },
    }
  );

  // Convert timestamps to human-readable dates
  return response.data.prices.map((item: [number, number]) => ({
    time: new Date(item[0]).toLocaleDateString("en-US"), // converts to "MM/DD/YYYY" format
    price: item[1],
  }));
};

// React Query Hook to fetch Bitcoin data with caching
export const useBitcoinData = () => {
  const query = useQuery({
    queryKey: ["bitcoinData"],
    queryFn: fetchBitcoinData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SolanaDataPoint {
  time: string;
  price: number;
}

// Fetch function for Solana data with timestamp conversion
const fetchSolanaData = async (): Promise<SolanaDataPoint[]> => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/solana/market_chart",
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

// React Query Hook to fetch Solana data with caching
export const useSolanaData = () => {
  const query = useQuery({
    queryKey: ["solanaData"],
    queryFn: fetchSolanaData,
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

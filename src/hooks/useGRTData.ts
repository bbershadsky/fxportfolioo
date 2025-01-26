"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface GRTDataPoint {
  time: string;
  price: number;
}

// Fetch function for GRT data with timestamp conversion
const fetchGRTData = async (): Promise<GRTDataPoint[]> => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/the-graph/market_chart",
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
    time: new Date(item[0]).toLocaleDateString("en-US"),
    price: item[1],
  }));
};

// React Query Hook to fetch GRT data with caching
export const useGRTData = () => {
  const query = useQuery({
    queryKey: ["grtData"],
    queryFn: fetchGRTData,
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

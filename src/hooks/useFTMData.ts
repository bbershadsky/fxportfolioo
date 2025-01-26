"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface FTMDataPoint {
  time: string;
  price: number;
}

// Fetch function for FTM data with timestamp conversion
const fetchFTMData = async (): Promise<FTMDataPoint[]> => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/fantom/market_chart",
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

// React Query Hook to fetch FTM data with caching
export const useFTMData = () => {
  const query = useQuery({
    queryKey: ["ftmData"],
    queryFn: fetchFTMData,
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

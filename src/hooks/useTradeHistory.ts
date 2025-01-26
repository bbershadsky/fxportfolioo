import { useQuery } from "@tanstack/react-query";
import { getTradeHistory, TradeHistoryItem } from "@/services/myfxbookApi";

export const useTradeHistory = (session: string, id: string) =>
  useQuery<TradeHistoryItem[], Error>({
    queryKey: ["tradehistory", session, id],
    queryFn: () => getTradeHistory(session, id),
    staleTime: 60000 * 5, // Optional: caching data for 5m
  });

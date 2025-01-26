import { useQuery } from "@tanstack/react-query";
import { getOpenTrades, OpenTradesResponse } from "@/services/myfxbookApi";
import { useSession } from "@/context/SessionContext";

export const useOpenTrades = () => {
  const { session, id } = useSession();

  return useQuery<OpenTradesResponse, Error>({
    queryKey: ["openTrades", session, id],
    queryFn: () => getOpenTrades(session, id),
  });
};

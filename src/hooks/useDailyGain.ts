import { useQuery } from "@tanstack/react-query";
import { getDailyGain, DailyGainItem } from "@/services/myfxbookApi";

export const useDailyGain = (
  session: string,
  id: string,
  startDate: string,
  endDate: string
) =>
  useQuery<DailyGainItem[], Error>({
    queryKey: ["dailyGain", session, id, startDate, endDate],
    queryFn: () => getDailyGain(session, id, startDate, endDate),
  });

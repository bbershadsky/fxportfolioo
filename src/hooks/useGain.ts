import { useQuery } from "@tanstack/react-query";
import { getGain, GainItem } from "@/services/myfxbookApi";

export const useGain = (
  session: string,
  id: string,
  startDate: string,
  endDate: string
) =>
  useQuery<GainItem[], Error>({
    queryKey: ["gain", session, id, startDate, endDate],
    queryFn: () => getGain(session, id, startDate, endDate),
  });

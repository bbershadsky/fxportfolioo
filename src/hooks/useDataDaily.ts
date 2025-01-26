import { DataDailyResponse, getDataDaily } from "@/services/myfxbookApi";
import { useContext, useEffect } from "react";

import { InvestmentContext } from "@/context/InvestmentContext";
import { useQuery } from "@tanstack/react-query";

export const useDataDaily = (
  session: string,
  id: string,
  startDate: string,
  endDate: string
) => {
  const investmentContext = useContext(InvestmentContext);

  if (!investmentContext) {
    throw new Error("InvestmentContext is not available");
  }
  const CREDIT_OFFSET = 1000;

  const { setLatestBalance } = investmentContext;

  const query = useQuery<DataDailyResponse, Error>({
    queryKey: ["dataDaily", session, id, startDate, endDate],
    queryFn: () => getDataDaily(session, id, startDate, endDate),
  });

  // useEffect(() => {
  //   if (query.data && query.data.dataDaily.length > 0) {
  //     // Flatten dataDaily to access the last available balance entry
  //     const flattenedData = query.data.dataDaily.flat();
  //     const lastItem = flattenedData[flattenedData.length - 1];

      // if (lastItem && lastItem.balance) {
      //   setLatestBalance(lastItem.balance + CREDIT_OFFSET); // Set the latest balance in context
      // }
    // }
  // }, [query.data]);

  return query;
};

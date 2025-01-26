"use client";

import { AccountData, TradeHistoryItem, fetchAccountData } from "@/services/myfxbookApi";
import React, { createContext, useEffect, useState } from "react";

import { MYFXBOOK_SESSION } from "@/config";

interface InvestmentContextProps {
  accountData: AccountData | null; // Add this line
  isLoading: any;
  error: any;
  totalDrawdown: number;
  setTotalDrawdown: (value: number) => void;
  latestBalance: number;
  tradeHistory: TradeHistoryItem[];
  setLatestBalance: (value: number) => void;
  setTradeHistory: (value: TradeHistoryItem[]) => void;
}

interface InvestmentProviderProps {
  children: React.ReactNode;
}

export const InvestmentContext = createContext<
  InvestmentContextProps | undefined
>(undefined);

interface InvestmentContextType {
  accountData: AccountData | null;
  isLoading: boolean;
  error: string | null;
  totalDrawdown: number;
  setTotalDrawdown: (value: number) => void;
}

export const InvestmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDrawdown, setTotalDrawdown] = useState(0);

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        const data = await fetchAccountData(MYFXBOOK_SESSION);
        setAccountData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch account data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountData();
  }, []);

  return (
    <InvestmentContext.Provider value={{ 
      accountData, 
      isLoading, 
      error, 
      totalDrawdown, 
      setTotalDrawdown,
      latestBalance: 0, // Placeholder value, replace with actual state or logic
      tradeHistory: [], // Placeholder value, replace with actual state or logic
      setLatestBalance: () => {}, // Placeholder function, replace with actual state setter
      setTradeHistory: () => {} // Placeholder function, replace with actual state setter
    }}>
      {/* accountData, 
      isLoading, 
      error,  
      totalDrawdown, 
      setTotalDrawdown*/}
      {children}
    </InvestmentContext.Provider>
  );
};

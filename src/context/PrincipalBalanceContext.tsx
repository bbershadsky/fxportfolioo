"use client";

import React, { createContext, useState, useEffect } from "react";

interface PrincipalBalanceContextProps {
  principalBalance: number;
  setPrincipalBalance: (value: number) => void;
}

export const PrincipalBalanceContext = createContext<
  PrincipalBalanceContextProps | undefined
>(undefined);

export function PrincipalBalanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [principalBalance, setPrincipalBalance] = useState<number>(0);

  useEffect(() => {
    const storedBalance = localStorage.getItem("PRINCIPAL_BALANCE");
    if (storedBalance) {
      setPrincipalBalance(Number(storedBalance));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("PRINCIPAL_BALANCE", principalBalance.toString());
  }, [principalBalance]);

  return (
    <PrincipalBalanceContext.Provider
      value={{ principalBalance, setPrincipalBalance }}
    >
      {children}
    </PrincipalBalanceContext.Provider>
  );
}

"use client";

import React, { useContext } from "react";

import { AuroraText } from "@/components/ui/aurora-text";
import { HistoricalBalanceChart } from "./HistoricalBalanceChart";
import { InvestmentContext } from "@/context/InvestmentContext";
import { OpenPositions } from "./OpenPositions";
import RiskSlider from "./RiskSlider";
import TradeHistoryList from "./TradeHistoryList";
import { useSession } from "@/context/SessionContext";

export const InvestmentsList: React.FC = () => {
  const { totalDrawdown, setTotalDrawdown, latestBalance, setLatestBalance } =
    useContext(InvestmentContext)!;

  const { session, id } = useSession();
  const risk = latestBalance > 0 ? (totalDrawdown / latestBalance) * 100 : 0;

  return (
    <div>
      <HistoricalBalanceChart />
      <div className="text-center font-bold text-lg mb-4">
        
        
        <h2 className="text-2xl font-bold tracking-tighter md:text-3xl lg:text-2xl"><AuroraText>Open Positions</AuroraText></h2>
        </div>
      <OpenPositions session={session} id={id} />
     <RiskSlider risk={risk} />
      <TradeHistoryList />
    </div>
  );
};

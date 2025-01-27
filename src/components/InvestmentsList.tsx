"use client";

import type React from "react";

import { AuroraText } from "@/components/ui/aurora-text";
import { HistoricalBalanceChart } from "./HistoricalBalanceChart";
import { OpenPositions } from "./OpenPositions";
import { RiskSlider } from "./RiskSlider";
import TradeHistoryList from "./TradeHistoryList";
import { useSession } from "@/context/SessionContext";

export const InvestmentsList: React.FC = () => {
  const { session, id } = useSession();

  return (
    <div>
      <div className="text-center font-bold text-lg mb-4">
        <h2 className="text-2xl font-bold tracking-tighter md:text-3xl lg:text-2xl">
          <AuroraText>Open Positions</AuroraText>
        </h2>
      </div>
      <RiskSlider />
      <div className="mb-4">
        <OpenPositions session={session} id={id} />
      </div>
      <HistoricalBalanceChart />
      <TradeHistoryList />
    </div>
  );
};

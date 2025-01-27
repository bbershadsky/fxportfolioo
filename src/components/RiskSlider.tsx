"use client";

import type React from "react";
import { Slider } from "@/components/ui/slider";
import { InvestmentContext } from "@/context/InvestmentContext";
import { useContext } from "react";

export const RiskSlider: React.FC = () => {
  const investmentContext = useContext(InvestmentContext);

  if (!investmentContext) {
    return <div>Context not available.</div>;
  }

  const { totalDrawdown, latestBalance } = investmentContext;
  const risk = latestBalance > 0 ? (totalDrawdown / latestBalance) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Top row: Risk left-aligned, $ right-aligned */}
      <div className="flex justify-between w-full">
        <h1 className="text-xl font-bold text-left">
          Risk: {Math.abs(risk).toFixed(2)}%
        </h1>
        <h1 className="text-xl font-bold text-right">
          ${Math.abs(totalDrawdown).toFixed(2)}
        </h1>
      </div>

      {/* Slider area */}
      <div className="relative w-full">
        <Slider
          value={[Math.abs(risk)]}
          min={0}
          max={30}
          step={1}
          aria-label="Risk"
          className="relative w-full"
          onChange={() => {}}
        />
        {/* Gradient background behind the slider track */}
        <div
          className="absolute top-0 left-0 h-full w-full rounded-lg"
          style={{
            background: "linear-gradient(to right, green, yellow, orange, red)",
            zIndex: -1,
          }}
        />
      </div>

      {/* Range labels under the slider */}
      <div className="flex justify-between text-sm text-muted-foreground w-full">
        <span>0%</span>
        <span>10%</span>
        <span>20%</span>
        <span>30%</span>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";

interface RiskSliderProps {
  risk: number;
}

const RiskSlider: React.FC<RiskSliderProps> = ({ risk }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto text-center">
      <h1 className="text-xl font-bold mb-2">Risk: {Math.abs(risk).toFixed(2)}%</h1>
      <div className="relative w-full">
      <Slider
          value={[Math.abs(risk)]}
          min={0}
          max={30}
          step={1}
          aria-label="Risk"
          className="relative w-full"
          style={{
            // Custom style for the thumb color can be applied here if needed
          }}
          onChange={() => {}}
        />
        <div
          className="absolute top-0 left-0 h-full w-full rounded-lg"
          style={{
            background: "linear-gradient(to right, green, yellow, orange, red)",
            zIndex: -1,
          }}
        ></div>
      </div>
      <div className="flex justify-between text-sm mt-2 text-muted-foreground w-full">
        <span>0%</span>
        <span>10%</span>
        <span>20%</span>
        <span>30%</span>
      </div>
    </div>
  );
};

export default RiskSlider;

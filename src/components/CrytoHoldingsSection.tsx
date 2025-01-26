"use client";
import { DATA } from "@/data/resume";
import React from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { BTCChart } from "./BTCChart";
import ETHChart from "./ETHChart";
import ADAChart from "./ADAChart";
import SOLChart from "./SOLChart";
import CombinedHoldingsWithPrices2 from "./CombinedHoldingsWithPrices2";
// import FTMChart from "./FTMChart";
// import GRTChart from "./GRTChart";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

// Prepare chart data and options
const pieData = {
  labels: DATA.skills.map((skill) => skill.asset),
  datasets: [
    {
      data: DATA.skills.map((skill) => skill.percentage),
      backgroundColor: ["#F87171", "#60A5FA", "#34D399"],
      borderColor: ["#F87171", "#60A5FA", "#34D399"],
      borderWidth: 1,
    },
  ],
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

export default function CryptoHoldingsSection() {
  const BLUR_FADE_DELAY = 0.04;

  return (
    <>
      <div className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 9}>
          
          <h2 className="text-xl font-bold">Digital Assets</h2>
        </BlurFade>

          <div className="col-span-full lg:col-span-1 lg:max-w-full">
            <BTCChart className="w-full h-full" />
          </div>
          <div className="col-span-full lg:col-span-1 lg:max-w-full">
            <ETHChart className="w-full h-full" />
          </div>
          <div className="col-span-full lg:col-span-1 lg:max-w-full">
            <ADAChart className="w-full h-full" />
          </div>
          <div className="col-span-full lg:col-span-1 lg:max-w-full">
            <SOLChart className="w-full h-full" />
          </div>
        

          {/* <div className="col-span-full lg:col-span-1 lg:max-w-full">
            <GRTChart className="w-full h-full" />
          </div> */}
          {/* <div className="col-span-full lg:col-span-1 lg:max-w-full">
            <FTMChart className="w-full h-full" />
          </div> */}
      </div>
      <br/>
      
      <div className="flex min-h-0 flex-col gap-y-3">
        {/* <CombinedHoldingsWithPrices/> */}
      </div>
      <div className="flex min-h-0 flex-col gap-y-3">
        <CombinedHoldingsWithPrices2/>
      </div>
      
    </>
      
  );
}

"use client";

import React, { useEffect, useRef } from "react";

import { useTheme } from "next-themes";

const NVDAChart: React.FC = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.innerHTML) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;

      script.onload = () => {
        new (window as any).TradingView.widget({
          symbol: "NASDAQ:NVDA",
          container_id: containerRef.current?.id,
          autosize: true,
          theme: theme,
          interval: "4H",
          timezone: "Etc/UTC",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          hide_top_toolbar: true,
          hide_legend: false,
          save_image: false,
        });
      };

      containerRef.current.appendChild(script);
    }
  }, [theme]); // Added 'theme' as a dependency here

  return (
    <div className="tradingview-widget-container">
      <div
        id="tradingview_tsla_chart"
        ref={containerRef}
        className="h-96 w-full rounded-md overflow-hidden shadow-lg"
      />
    </div>
  );
};

export default NVDAChart;

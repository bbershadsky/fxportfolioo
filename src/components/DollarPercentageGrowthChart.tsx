"use client";

import React from "react";
import { useDailyGain } from "@/hooks/useDailyGain";
import { PrincipalBalanceContext } from "@/context/PrincipalBalanceContext";
import { MYFXBOOK_SESSION, MYFXBOOK_ID } from "@/config";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type DailyGainItem = {
  date: string;
  value: number;   // Cumulative Growth (%)
  profit: number;  // Profit ($)
};

const DollarPercentageChart: React.FC = () => {
  const { principalBalance } = React.useContext(PrincipalBalanceContext)!;

  const {
    data: dailyGain,
    error,
    isLoading,
    refetch,
  } = useDailyGain(MYFXBOOK_SESSION, MYFXBOOK_ID, "2000-01-01", "2030-12-31");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading daily gain data: {error.message}</div>;
  if (!dailyGain || dailyGain.length === 0) return <div>No daily gain data available.</div>;

  // Ensure no values are below 0
  const processedData = dailyGain.map((item: DailyGainItem) => ({
    ...item,
    // If value (growth) is below 0, set it to 0
    value: item.value < 0 ? 0 : item.value,
    // If profit is below 0, hide it by setting to null or coerce to 0 if you prefer
    profit: item.profit < 0 ? 0 : item.profit,
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  };

  return (
    <Card className="p-4">
      <div className="text-center font-bold text-lg mb-4">
        Aggressive Low Risk Growth Portfolio Performance
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-medium"></CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={processedData}
            margin={{ top: 20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
              angle={0}
              dy={10}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickFormatter={(val: number) => Number(val).toFixed(2) + "%"}
              domain={[0, 'dataMax']}
              stroke="#4CAF50"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={(val: number) => "$" + Number(val).toFixed(2)}
              domain={[0, 'dataMax']}
              stroke="#14B8A6" // Teal color for better dark mode compatibility
            />
            <Tooltip
              formatter={(value: number | string, name: string) => {
                const valNum = Number(value);
                if (isNaN(valNum)) return "";
                if (name.includes("Growth")) {
                  return valNum.toFixed(2) + "%";
                } else {
                  return "$" + valNum.toFixed(2);
                }
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="value"
              name="Cumulative Growth (%)"
              fill="rgba(76,175,80,0.6)"
              stroke="rgba(76,175,80,1)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="profit"
              name="Profit ($)"
              stroke="#14B8A6"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DollarPercentageChart;

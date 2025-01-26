"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import moment from "moment";
import { useSession } from "@/context/SessionContext";

interface DataItem {
  date: string;
  balance: number;
  equity: number;
}

export const HistoricalBalanceChart: React.FC = () => {
  const { session, id, start } = useSession();
  const [data, setData] = useState<DataItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>(start);
  const [endDate, setEndDate] = useState<string>(moment().format("YYYY-MM-DD"));

  const fetchData = async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get(
        `https://www.myfxbook.com/api/get-data-daily.json`,
        {
          params: {
            session,
            id,
            start: startDate,
            end: endDate,
          },
        }
      );

      if (!response.data.error) {
        const dataDaily = response.data.dataDaily.flat().map((item: any) => ({
          date: moment(item.date, "MM/DD/YYYY").format("YYYY-MM-DD"),
          // Clamp negative values to zero
          balance: Math.max(parseFloat(item.balance), 0),
          equity: Math.max(parseFloat(item.balance) - parseFloat(item.floatingPL), 0),
        }));
        setData(dataDaily);

        // If we have data and startDate is not set, set it to the first date
        if (dataDaily.length > 0 && !startDate) {
          setStartDate(dataDaily[0].date);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching data daily:", err);
      setError("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  if (error) return <div>Error: {error}</div>;
  if (!data.length) return <div>Loading...</div>;

  // Format X-axis dates as MMM dd
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  };

  // Y-axis ticks in k (no decimals)
  const formatYAxis = (value: number) => {
    const valInK = value / 1000;
    return valInK.toFixed(0) + "k"; // e.g. 1000 => 1k
  };

  // Tooltip formatter for comma separators
  const numberFormatter = Intl.NumberFormat("en-US");
  const tooltipFormatter = (value: number, name: string) => {
    const formatted = numberFormatter.format(Number(value));
    return `$${formatted}`;
  };

  return (
    <div>
      <div className="text-center font-bold text-lg mb-4">
        <h2 className="text-xl font-bold">Historical Balance Including Credit</h2>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button onClick={() => fetchData(startDate, endDate)}>Refresh</Button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            angle={0}
            dy={10}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12 }}
            // Start at 1000, so no negative display
            domain={[1000, 'dataMax']}
          />
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          {/* Orange line first so it's underneath */}
          <Line
            type="monotone"
            dataKey="equity"
            name="Equity"
            stroke="rgba(250,140,22,1)"
            strokeWidth={2}
            dot={false}
          />
          {/* Blue line last so it's on top */}
          <Line
            type="monotone"
            dataKey="balance"
            name="Historical Balance"
            stroke="rgba(24,144,255,1)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

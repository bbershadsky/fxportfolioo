"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEthereumData } from "@/hooks/useEthereumData"; // Import the Ethereum data hook
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  className?: string;
}

interface ChartDataPoint {
  time: string;
  price: number;
}

export function ETHChart({ className }: Props) {
  const { data, loading } = useEthereumData();

  // Transform and scale data for the chart
  const chartData: ChartDataPoint[] = data.map((point) => ({
    time: new Date(point.time).toLocaleDateString(), // Format timestamp to date string
    price: point.price,
  }));

  // Calculate min and max prices for scaling
  const priceValues = chartData.map((d) => d.price);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);
  const padding = (maxPrice - minPrice) * 0.05;

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full",
        className
      )}
    >
      <CardHeader className="px-4">
        <CardTitle className="mt-1 text-base">Ethereum</CardTitle>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-4">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis 
                domain={[minPrice - padding, maxPrice + padding]} 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`} // Abbreviates values to 'K'
              />
              <Tooltip 
                formatter={(value: number | string) => 
                  typeof value === 'number' ? `$${value.toFixed(2)}` : value
                } 
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10b981" // Ethereum-specific color
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default ETHChart;

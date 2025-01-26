"use client";
import React, { useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { InvestmentContext } from "@/context/InvestmentContext";
import { useOpenTrades } from "@/hooks/useOpenTrades";

interface OpenPositionsProps {
  session: string;
  id: string;
}

export const OpenPositions: React.FC<OpenPositionsProps> = ({ }) => {
  const { data, isLoading, error } = useOpenTrades();
  const { totalDrawdown, setTotalDrawdown } = useContext(InvestmentContext)!;

  React.useEffect(() => {
    if (data && !data.error) {
      const totalDrawdown = data.openTrades.reduce(
        (sum, trade) => sum + parseFloat(trade.profit),
        0
      );
      setTotalDrawdown(totalDrawdown);
    }
  }, [data, setTotalDrawdown]);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error || (data && data.error)) {
    return <div>Error loading open positions.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Action</TableHead>
          <TableHead className="text-right">Lots</TableHead>
          <TableHead className="text-right">Open</TableHead>
          <TableHead className="text-right">TP</TableHead>
          <TableHead className="hidden sm:table-cell text-right">Pips</TableHead>
          <TableHead className="hidden sm:table-cell text-right">Swap</TableHead>
          <TableHead className="text-right">Profit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.openTrades.map((trade) => (
          <TableRow key={trade.openTime}>
            <TableCell>{trade.symbol}</TableCell>
            <TableCell>{trade.action}</TableCell>
            <TableCell className="text-right">{trade.sizing.value}</TableCell>
            <TableCell className="text-right">{trade.openPrice}</TableCell>
            <TableCell className="text-right">{trade.tp}</TableCell>
            <TableCell className="hidden sm:table-cell text-right">
              {trade.pips}
            </TableCell>
            <TableCell className="hidden sm:table-cell text-right">
              {trade.swap}
            </TableCell>
            <TableCell className="text-right">{parseFloat(trade.profit).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

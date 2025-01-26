"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/context/SessionContext";
import { useTradeHistory } from "@/hooks/useTradeHistory";

export interface TradeHistoryItem {
  openTime: string;
  closeTime: string;
  symbol: string;
  action: string;
  sizing?: {
    value: string; // <-- If your API gives you a string
  };
  openPrice: number;
  closePrice?: number;
  tp?: number;
  pips?: number;
  interest?: number;
  commission?: number;
  profit: number;
}

// Group trades by (symbol, closeTime) if they are consecutive
function groupBySymbolAndCloseTime<T extends { symbol: string; closeTime: string }>(
  trades: T[]
): T[][] {
  const groups: T[][] = [];
  let currentGroup: T[] = [];
  let lastKey: string | null = null;

  for (const trade of trades) {
    const key = `${trade.symbol}-${trade.closeTime}`;
    if (key !== lastKey) {
      if (currentGroup.length) groups.push(currentGroup);
      currentGroup = [trade];
      lastKey = key;
    } else {
      currentGroup.push(trade);
    }
  }
  if (currentGroup.length) groups.push(currentGroup);
  return groups;
}

export const TradeHistoryList: React.FC = () => {
  const { session, id } = useSession();
  const { data: tradeHistory, error, isLoading, refetch } = useTradeHistory(session, id);

  const [showLocalTime, setShowLocalTime] = useState(true);
  const [showDepositsWithdrawals, setShowDepositsWithdrawals] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <span className="ml-3 text-sm text-muted-foreground">
          Loading trade history...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading trade history: {error.message}
      </div>
    );
  }

  if (!tradeHistory || tradeHistory.length === 0) {
    return <div>No trade history available.</div>;
  }

  const formatDate = (utcDateTime: string) => {
    const date = new Date(utcDateTime);
    if (!showLocalTime) {
      // UTC format
      const monthDay = date.toUTCString().slice(5, 11);
      const time = date.toUTCString().slice(17, 22);
      return (
        <>
          <span className="inline">{monthDay}, </span>
          <span>{time}</span>
        </>
      );
    }
    // Local time format
    const monthDay = Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
    const time = Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
    return (
      <>
        <span className="inline">{monthDay}, </span>
        <span>{time}</span>
      </>
    );
  };

  // Filter if only deposits/withdrawals
  const filteredHistory = showDepositsWithdrawals
    ? tradeHistory.filter((t) => {
        const action = t.action.toLowerCase();
        return action === "deposit" || action === "withdrawal";
      })
    : tradeHistory.filter((t) => {
        const action = t.action.toLowerCase();
        return action !== "deposit" && action !== "withdrawal";
      });

  // Paginate
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Group consecutive trades by (symbol, closeTime) (on current page)
  const groupedTrades = groupBySymbolAndCloseTime(paginatedHistory);

  return (
    <Card className="w-full mt-4 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-primary text-center mb-6">
          Trade History
        </h2>
        <div className="mb-4 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setShowDepositsWithdrawals(!showDepositsWithdrawals)}
            className="px-4 py-2"
          >
            {showDepositsWithdrawals
              ? "Show All Trades"
              : "Show Deposits/Withdrawals Only"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowLocalTime(!showLocalTime)}
            className="px-4 py-2"
          >
            {showLocalTime ? "UTC" : "Local"}
          </Button>

          <Button variant="outline" onClick={() => refetch()} className="px-4 py-2">
            <RefreshCw />
          </Button>
        </div>

        <div className="overflow-x-auto rounded-md shadow-inner border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 font-semibold text-sm text-left text-muted-foreground dark:text-gray-200 hidden sm:table-cell">
                  Open
                </th>
                <th className="px-4 py-2 font-semibold text-sm text-left text-muted-foreground dark:text-gray-200">
                  Close
                </th>
                <th className="px-4 py-2 font-semibold text-sm text-left text-muted-foreground dark:text-gray-200">
                  Symbol
                </th>
                <th className="px-4 py-2 font-semibold text-sm text-left text-muted-foreground dark:text-gray-200 hidden sm:table-cell">
                  Action
                </th>
                <th className="px-4 py-2 font-semibold text-sm text-right text-muted-foreground dark:text-gray-200 hidden sm:table-cell">
                  Size
                </th>
                <th className="px-4 py-2 font-semibold text-sm text-left text-muted-foreground dark:text-gray-200 sm:hidden">
                  Action (Size)
                </th>
                <th className="hidden sm:table-cell px-4 py-2 font-semibold text-sm text-right text-muted-foreground dark:text-gray-200">
                  Open
                </th>
                <th className="hidden sm:table-cell px-4 py-2 font-semibold text-sm text-right text-muted-foreground dark:text-gray-200">
                  Close
                </th>
                <th className="hidden sm:table-cell px-4 py-2 font-semibold text-sm text-right text-muted-foreground dark:text-gray-200">
                  TP
                </th>
                <th className="hidden sm:table-cell px-4 py-2 font-semibold text-sm text-right text-muted-foreground dark:text-gray-200">
                  Pips
                </th>
                <th className="hidden sm:table-cell px-4 py-2 font-semibold text-sm text-right text-muted-foreground dark:text-gray-200">
                  Interest
                </th>
                <th className="hidden sm:table-cell px-4 py-2 font-semibold text-sm text-right text-muted-foreground dark:text-gray-200">
                  Commission
                </th>
                <th
                  className={cn(
                    "px-4 py-2 font-semibold text-sm text-right text-muted-foreground dark:text-gray-200",
                    "sticky right-0 bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  Profit
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedTrades.map((group, groupIdx) =>
                group.map((trade, rowIdx) => {
                  const isFirstInGroup = rowIdx === 0;
                  const isLastInGroup = rowIdx === group.length - 1;

                  // Extra tailwind border classes for the first & last row in each group
                  const rowClasses = cn(
                    "border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900",
                    isFirstInGroup && "border-t-2 border-primary", // highlight top
                    isLastInGroup && "border-b-2 border-primary"   // highlight bottom
                  );

                  return (
                    <tr
                      key={`${trade.openTime}-${groupIdx}-${rowIdx}`}
                      className={rowClasses}
                    >
                      <td className="px-4 py-2 hidden sm:table-cell">
                        {formatDate(trade.openTime)}
                      </td>
                      <td className="px-4 py-2">{formatDate(trade.closeTime)}</td>
                      <td className="px-4 py-2 font-medium">{trade.symbol}</td>

                      {/* Desktop Action */}
                      <td className="px-4 py-2 hidden sm:table-cell">
                        <Badge variant="outline" className="px-2 py-1 text-xs">
                          {trade.action}
                        </Badge>
                      </td>

                      {/* Desktop Size */}
                      <td className="px-4 py-2 hidden sm:table-cell text-right">
                        {/* parseFloat if sizing.value is string */}
                        {trade.sizing?.value ? parseFloat(trade.sizing.value) : ""}
                      </td>

                      {/* Mobile: Action (Size) */}
                      <td className="px-4 py-2 sm:hidden">
                        <Badge variant="outline" className="px-2 py-1 text-xs mr-2">
                          {trade.action}
                        </Badge>
                        <span className="text-right inline-block w-8">
                          {trade.sizing?.value ? parseFloat(trade.sizing.value) : ""}
                        </span>
                      </td>

                      <td className="hidden sm:table-cell px-4 py-2 text-right">
                        ${trade.openPrice.toFixed(5)}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-2 text-right">
                        {trade.closePrice !== undefined
                          ? `$${trade.closePrice.toFixed(5)}`
                          : ""}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-2 text-right">
                        {trade.tp}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-2 text-right">
                        {trade.pips}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-2 text-right">
                        {trade.interest !== undefined ? `$${trade.interest.toFixed(2)}` : ""}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-2 text-right">
                        {trade.commission !== undefined
                          ? `$${trade.commission.toFixed(2)}`
                          : ""}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-2 font-semibold sticky right-0 text-right bg-green-600",
                          trade.profit < 0 ? "text-red-300" : "text-green-900"
                        )}
                      >
                        ${trade.profit.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeHistoryList;

"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InvestmentProvider } from "@/context/InvestmentContext";
import { PrincipalBalanceProvider } from "@/context/PrincipalBalanceContext";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/context/SessionContext";

const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrincipalBalanceProvider>
        <InvestmentProvider>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system"  enableSystem
            disableTransitionOnChange>
              <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
            </ThemeProvider>
          </SessionProvider>
        </InvestmentProvider>
      </PrincipalBalanceProvider>
    </QueryClientProvider>
  );
}

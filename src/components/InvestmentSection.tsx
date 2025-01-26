"use client";

import AccountStats from "./AccountStats";
import BalanceDisplay from "./BalanceDisplay";
import { PrincipalBalanceProvider } from "@/context/PrincipalBalanceContext";

export default function InvestmentSection() {
  return (
    <PrincipalBalanceProvider>
      <InnerInvestmentSection />
    </PrincipalBalanceProvider>
  );
}

function InnerInvestmentSection() {
  return (
    <div>
      <BalanceDisplay />
      {/* <AccountStats /> */}
    </div>
  );
}

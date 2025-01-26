"use client";

import type React from "react";
import { useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Import your environment/fallback values
import { MYFXBOOK_ID, MYFXBOOK_SESSION } from "@/config";

import { useDataDaily } from "@/hooks/useDataDaily";
import { useGain } from "@/hooks/useGain";
import { InvestmentContext } from "@/context/InvestmentContext";
import { PrincipalBalanceContext } from "@/context/PrincipalBalanceContext";

import SecuredProfitsCard from "./SecuredProfitsCard";
import SettingsModal from "./SettingsModal";
import { MagicCard } from "./ui/magic-card";
import NumberTicker from "./ui/number-ticker";
// etc...

const BalanceDisplay: React.FC = () => {
  const { theme } = useTheme();
  const investmentContext = useContext(InvestmentContext);
  const principalBalanceContext = useContext(PrincipalBalanceContext);

  // Local state to store override values for Myfxbook session/ID
  const [overriddenSession, setOverriddenSession] = useState("");
  const [overriddenId, setOverriddenId] = useState("");

  // Modal open state
  const [isModalOpen, setModalOpen] = useState(false);

  // On mount, read any previously saved overrides
  useEffect(() => {
    const storedSession = localStorage.getItem("myfx_session_override");
    const storedId = localStorage.getItem("myfx_id_override");
    if (storedSession) setOverriddenSession(storedSession);
    if (storedId) setOverriddenId(storedId);
  }, []);

  // Decide final credentials to use in your data hooks
  const finalSession = overriddenSession || MYFXBOOK_SESSION;
  const finalId = overriddenId || MYFXBOOK_ID;

  // Use the final session/ID in your API hooks
  useDataDaily(finalSession, finalId, "2000-01-01", "2030-12-31");
  const res = useGain(finalSession, finalId, "2000-01-01", "2030-12-31");

  // Optionally handle BTC address or other fields...
  const [btcAddress, setBTCAddress] = useState<string>("");

  useEffect(() => {
    const savedAddress = localStorage.getItem("btcAddress");
    if (savedAddress) {
      setBTCAddress(savedAddress);
    }
  }, []);

  useEffect(() => {
    if (btcAddress) {
      localStorage.setItem("btcAddress", btcAddress);
    }
  }, [btcAddress]);

  useEffect(() => {
    if (
      principalBalanceContext &&
      principalBalanceContext.principalBalance < 1
    ) {
      principalBalanceContext.setPrincipalBalance(5000);
    }
  }, [principalBalanceContext]);

  if (!investmentContext || !principalBalanceContext) {
    return <div>Context not available.</div>;
  }

  if (investmentContext.isLoading) {
    return <div>Loading...</div>;
  }

  if (investmentContext.error) {
    return <div>Error: {investmentContext.error}</div>;
  }

  const { accountData } = investmentContext;

  return (
    <section id="balance" className="pb-3 px-2 mx-auto max-w-screen-md">
      {/* Button to open the settings modal */}
      {/* <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Override Env Values
        </button>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accountData &&
          Object.entries(accountData)
            .filter(
              ([key]) => !["deposits", "equity", "lastUpdateDate"].includes(key)
            )
            .map(([key, value]) => (
              <MagicCard
                key={key}
                className="flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl tracking-tighter"
                gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
              >
                <h2 className="text-lg font-semibold mb-2 text-center">
                  {key === "balance"
                    ? "Balance $"
                    : key === "absGain"
                    ? "Gain %"
                    : key === "daily"
                    ? "Daily %"
                    : key === "monthly"
                    ? "Monthly %"
                    : key === "profit"
                    ? "Profit $"
                    : key === "drawdown"
                    ? "Max Drawdown %"
                    : key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                </h2>
                <p className="whitespace-pre-wrap text-5xl font-medium tracking-tight text-center">
                  {key.includes("Gain") ||
                  key.includes("daily") ||
                  key.includes("monthly") ||
                  key.includes("drawdown") ? (
                    <NumberTicker
                      value={Number(value)}
                      decimalPlaces={2}
                      direction="up"
                      animationSpeed={1.2}
                    />
                  ) : key.includes("Date") ? (
                    <span>{String(value)}</span>
                  ) : key.includes("pips") ? (
                    <NumberTicker
                      value={Number(value)}
                      decimalPlaces={1}
                      direction="up"
                      animationSpeed={1.2}
                    />
                  ) : (
                    <NumberTicker
                      value={Number(value)}
                      decimalPlaces={2}
                      direction="up"
                      animationSpeed={1.2}
                    />
                  )}
                </p>
              </MagicCard>
            ))}
      </div>

      {/* <div className="flex flex-col gap-4 mt-8">
        <input
          type="text"
          placeholder="Enter BTC Address"
          className="border rounded-md px-4 py-2 w-full"
          value={btcAddress}
          onChange={(e) => setBTCAddress(e.target.value)}
        />
        {btcAddress && <SecuredProfitsCard btcAddress={btcAddress} />}
      </div> */}

      {/* Render the modal if open */}
      {isModalOpen && (
        <SettingsModal
          open={isModalOpen}
          setOpen={setModalOpen}
          sessionValue={overriddenSession}
          setSessionValue={setOverriddenSession}
          idValue={overriddenId}
          setIdValue={setOverriddenId}
        />
      )}
    </section>
  );
};

export default BalanceDisplay;

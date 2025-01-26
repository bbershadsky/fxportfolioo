"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MagicCard } from "./ui/magic-card";
import NumberTicker from "./ui/number-ticker";

interface SecuredProfitsCardProps {
    btcAddress: string;
}

const fetchBTCData = async (btcAddress: string): Promise<number> => {
    if (!btcAddress) throw new Error("BTC address is required");

    // Fetch balance in BTC from Blockchain.info API
    const balanceResponse = await axios.get(
        `https://blockchain.info/q/addressbalance/${btcAddress}`
    );
    const btcBalance = balanceResponse.data / 1e8; // Convert Satoshi to BTC

    // Fetch BTC to USD conversion rate
    const rateResponse = await axios.get(
        `https://blockchain.info/ticker`
    );
    const btcToUsdRate = rateResponse.data.USD.last;

    // Calculate USD value of the BTC balance
    return btcBalance * btcToUsdRate;
};

const SecuredProfitsCard: React.FC<SecuredProfitsCardProps> = ({ btcAddress }) => {
    const { data: usdValue, isLoading, isError } = useQuery({
        queryKey: ["btcBalance", btcAddress],
        queryFn: () => fetchBTCData(btcAddress),
        enabled: !!btcAddress, // Only run if BTC address is provided
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 1,
    });

    return (
        <MagicCard
            className="flex-col items-center justify-center shadow-2xl whitespace-nowrap text-4xl"
            gradientColor="#FFD70055" // Gold-like gradient for secured profits
        >
            <h2 className="text-lg font-semibold mb-2">Secured Profits</h2>
            {isLoading ? (
                <p className="text-lg">Loading...</p>
            ) : isError ? (
                <p className="text-lg text-red-500">Error loading balance</p>
            ) : (
                <p className="whitespace-pre-wrap text-5xl font-medium tracking-tighter">
                    <span>$ </span>
                    <NumberTicker value={usdValue || 0} decimalPlaces={2} />
                </p>
            )}
        </MagicCard>
    );
};

export default SecuredProfitsCard;

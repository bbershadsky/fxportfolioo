"use client";

import { useState, useEffect } from "react";
import { Client, Databases, Query } from "appwrite"; // Use Appwrite JS SDK
import { Slider } from "@/components/ui/slider"; // Import Slider from ShadCN UI
import NumberTicker from "@/components/ui/number-ticker"; // Replace with your NumberTicker component path

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const APPWRITE_HOLDINGS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_HOLDINGS_COLLECTION_ID!;
const limit = 100;
const coinsOfInterest = ["BTC", "ETH", "ARB", "SOL", "OP", "DOT", "VELODROME", "SUPER", "ADA"];

interface Holding {
    coin: string;
    available: number;
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
}

interface Price {
    symbol: string;
    price: number;
    high: number;
    low: number;
    change24: number;
    bidPr: number;
    askPr: number;
}

export default function CombinedHoldingsWithPrices2() {
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [prices, setPrices] = useState<Price[]>([]);
    const [loading, setLoading] = useState(true);

    const coinMapping: Record<string, string> = {
        "DOT28.S": "DOT", // Map DOT28.S to DOT
        "VELO": "VELODROME",
    };

    useEffect(() => {
        const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
        const databases = new Databases(client);

        const fetchHoldings = async () => {
            try {
                const res = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_HOLDINGS_COLLECTION_ID, [
                    Query.limit(limit),
                    Query.orderDesc("$updatedAt"),
                ]);
                const normalizedHoldings: Holding[] = res.documents.map((holding: any) => ({
                    ...holding,
                    coin: coinMapping[holding.coin] || holding.coin, // Normalize coin name
                }));
                setHoldings(normalizedHoldings);
            } catch (error) {
                console.error("Error fetching holdings:", error);
            }
        };

        const connectBinanceWebSocket = () => {
            const ws = new WebSocket(
                `wss://stream.binance.com:9443/ws/${coinsOfInterest.map((coin) => `${coin.toLowerCase()}usdt@ticker`).join("/")}`
            );

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setPrices((prevPrices) => {
                    const updatedPrices = [...prevPrices];
                    const index = updatedPrices.findIndex((price) => price.symbol === data.s);
                    const priceData: Price = {
                        symbol: data.s,
                        price: parseFloat(data.c), // Current price
                        high: parseFloat(data.h), // 24h high
                        low: parseFloat(data.l), // 24h low
                        change24: parseFloat(data.P) / 100, // 24h change percentage
                        bidPr: parseFloat(data.b), // Bid price
                        askPr: parseFloat(data.a), // Ask price
                    };
                    if (index !== -1) {
                        updatedPrices[index] = priceData;
                    } else {
                        updatedPrices.push(priceData);
                    }
                    return updatedPrices;
                });
            };

            ws.onclose = () => {
                console.log("Binance WebSocket closed. Reconnecting...");
                connectBinanceWebSocket(); // Reconnect on close
            };

            return ws;
        };

        const fetchData = async () => {
            await fetchHoldings();
            setLoading(false);
        };

        fetchData();

        const ws = connectBinanceWebSocket();

        return () => {
            ws.close(); // Cleanup WebSocket on component unmount
        };
    }, []);

    if (loading) {
        return <p>Loading data...</p>;
    }

    // Group holdings and prices
    const groupedHoldings = Object.fromEntries(holdings.map((holding) => [holding.coin, holding]));
    const groupedPrices = Object.fromEntries(prices.map((price) => [price.symbol, price]));

    // Combine and filter data
    const combinedData = Object.values(groupedHoldings)
        .map((holding) => {
            const priceData = groupedPrices[`${holding.coin}USDT`];
            return {
                coin: holding.coin,
                available: holding.available,
                price: priceData?.price ?? null,
                high: priceData?.high ?? null,
                low: priceData?.low ?? null,
                change24: priceData?.change24 ?? null,
                bidPr: priceData?.bidPr ?? null,
                askPr: priceData?.askPr ?? null,
                totalValue: priceData ? priceData.price * holding.available : null,
            };
        })
        .filter(
            (data) =>
                data.available >= 0.01 && // Exclude coins with `available < 0.01`
                !["BGB", "FTM", "USDT"].includes(data.coin) // Exclude specific coins
        )
        .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0)); // Sort by totalValue

    const totalBalance = combinedData.reduce((acc, data) => acc + (data.totalValue || 0), 0);

    return (
        <div className="flex flex-col gap-y-3">
            <div className="whitespace-pre-wrap text-5xl font-medium tracking-tighter text-center">
                <span>$ </span>
                <NumberTicker value={totalBalance} decimalPlaces={2} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {combinedData.map((data) => {
                    const hasPriceData = data.price !== null && data.bidPr !== null && data.askPr !== null && data.high !== null && data.low !== null && data.change24 !== null;

                    return (
                        <div key={data.coin} className="flex flex-col py-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    {data.coin} ({data.available})
                                </h3>
                                <p className="badge bg-green-200 text-green-800 rounded px-2 py-1">
                                    {data.totalValue
                                        ? `$${data.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                                        : "N/A"}
                                </p>
                            </div>

                            {hasPriceData && (
                                <>
                                    <div className="flex justify-between items-center">
                                        <h3>Price: {data.price ? `$${data.price.toFixed(2)}` : "N/A"}</h3>
                                        <h3
                                            className={
                                                data.change24 !== null
                                                    ? data.change24 > 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                    : ""
                                            }
                                        >
                                            24h: {data.change24 !== null ? `${(data.change24 * 100).toFixed(2)}%` : ""}
                                        </h3>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <h5>Bid: {data.bidPr !== null ? data.bidPr.toFixed(2) : "."}</h5>
                                        <h5>Ask: {data.askPr !== null ? data.askPr.toFixed(2) : "."}</h5>
                                    </div>
                                    <Slider
                                        value={[data.price || 0]} // Default to 0 if data.price is null
                                        min={data.low || 0}       // Default to 0 if data.low is null
                                        max={data.high || 0}      // Default to 0 if data.high is null
                                        className="slider bg-green-300 rounded-lg mt-2"
                                    />
                                    <div className="flex justify-between items-center">
                                        <h4>{data.bidPr !== null ? data.bidPr.toFixed(2) : ""}</h4>

                                        <h5>
                                            {`Δ ${data.high !== null && data.low !== null
                                                    ? (data.high - data.low).toFixed(2)
                                                    : ""
                                                }`}
                                        </h5>
                                        <h4>{data.high !== null ? data.high.toFixed(2) : ""}</h4>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

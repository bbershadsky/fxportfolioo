"use client";

import { useEffect, useState } from 'react';

import axios from 'axios';

interface AccountData {
  absGain: number;
  daily: number;
  monthly: number;
  deposits: number;
  profit: number;
  balance: number;
  drawdown: number;
  equity: number;
  lastUpdateDate: string;
  profitFactor: number;
  pips: number;
}

export default function AccountStats() {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
    const [error, setError] = useState<string>('');


  useEffect(() => {
    const fetchAccountData = async () => {
        try {
            const BASE_URL = "https://www.myfxbook.com/api";
          const SESSION = process.env.NEXT_PUBLIC_MFX_SESSION;
        const TARGET_ACCOUNT_ID = process.env.NEXT_PUBLIC_MFX_ACC_ID;

        const response = await axios.get(`${BASE_URL}/get-my-accounts.json?session=${SESSION}`);
        
        const targetAccount = response.data.accounts.find(
          (account: any) => account.id.toString() === TARGET_ACCOUNT_ID
        );

        if (targetAccount) {
          setAccountData({
            absGain: targetAccount.absGain,
            daily: targetAccount.daily,
            monthly: targetAccount.monthly,
            deposits: targetAccount.deposits,
            profit: targetAccount.profit,
            balance: targetAccount.balance,
            drawdown: targetAccount.drawdown,
            equity: targetAccount.equity,
            lastUpdateDate: targetAccount.lastUpdateDate,
            profitFactor: targetAccount.profitFactor,
            pips: targetAccount.pips,
          });
        } else {
          setError('Account not found');
        }
      } catch (err) {
        setError('Failed to fetch account data');
      }
    };

    fetchAccountData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!accountData) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      <div>Absolute Gain: {(accountData.absGain).toFixed(2)}%</div>
      <div>Daily: {(accountData.daily).toFixed(2)}%</div>
      <div>Monthly: {(accountData.monthly).toFixed(2)}%</div>
      <div>Deposit: ${accountData.balance - accountData.profit}</div>
      <div>Profit: ${accountData.profit.toLocaleString()}</div>
      <div>Balance: ${accountData.balance.toLocaleString()}</div>
      <div>Max Drawdown: {(accountData.drawdown).toFixed(2)}%</div>
      <div>Last Update: {accountData.lastUpdateDate}</div>
      <div>Profit Factor: {accountData.profitFactor.toFixed(2)}</div>
      <div>Pips: {accountData.pips.toFixed(1)}</div>
    </div>
  );
}
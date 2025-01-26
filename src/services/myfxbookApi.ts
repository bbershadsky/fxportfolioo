import axios from "axios";
const BASE_URL = "https://www.myfxbook.com/api";

export interface DataDailyItem {
  date: string;
  balance: number;
  floatingPL: number;
}

export interface DataDailyResponse {
  dataDaily: DataDailyItem[];
  error: boolean;
  message?: string;
}

export const getDataDaily = async (
  session: string,
  id: string,
  startDate: string,
  endDate: string
): Promise<DataDailyResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/get-data-daily.json`, {
      params: { session, id, start: startDate, end: endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data daily:", error);
    throw error;
  }
};

export interface OpenTrade {
  symbol: string;
  action: string;
  sizing: { value: number };
  openPrice: number;
  tp: number;
  pips: number;
  swap: number;
  profit: string;
  openTime: string;
}

export interface GainItem {
  error: string;
  message: string;
  value: number;
}

export interface OpenTradesResponse {
  openTrades: OpenTrade[];
  error: boolean;
  message?: string;
}

export const getOpenTrades = async (
  session: string,
  id: string
): Promise<OpenTradesResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/get-open-trades.json`, {
      params: { session, id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching open trades:", error);
    throw error;
  }
};

export interface TradeHistoryItem {
  openTime: string;
  closeTime: string;
  symbol: string;
  action: string;
  sizing: { value: string };
  openPrice: number;
  closePrice: number;
  tp: string;
  pips: string;
  interest: number;
  commission: number;
  profit: number;
}

export const getTradeHistory = async (
  session: string,
  id: string
): Promise<TradeHistoryItem[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/get-history.json`, {
      params: { session, id },
    });

    if (response.data.error) {
      throw new Error(response.data.message || "Error fetching trade history");
    }

    return response.data.history;
  } catch (error) {
    console.error("Error fetching trade history:", error);
    throw error;
  }
};

export interface DailyGainItem {
  date: string;
  value: number;
  profit: number;
}

export interface DailyGainResponse {
  error: boolean;
  message?: string;
  dailyGain: DailyGainItem[][];
}
export const getDailyGain = async (
  session: string,
  id: string,
  startDate: string,
  endDate: string
): Promise<DailyGainItem[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/get-daily-gain.json`, {
      params: { session, id, start: startDate, end: endDate },
    });

    const data: DailyGainResponse = response.data;

    if (data.error) {
      throw new Error(data.message || "Unknown error from API");
    }

    const dailyGain: DailyGainItem[] = data.dailyGain.flat();

    return dailyGain;
  } catch (error) {
    console.error("Error fetching daily gain:", error);
    throw error;
  }
};



export const getGain = async (
  session: string,
  id: string,
  startDate: string,
  endDate: string
): Promise<GainItem[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/get-gain.json`, {
      params: { session, id, start: startDate, end: endDate },
    });

    if (response.data.error) {
      return [{ error: 'true', message: response.data.message || 'Error fetching gain', value: 0 }];
    }

    return response.data.history || [{ error: 'false', message: '', value: 0 }];
  } catch (error) {
    console.error("Error fetching gain:", error);
    return [{ error: 'true', message: 'Failed to fetch gain data', value: 0 }];
  }
};


export interface AccountData {
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


export const fetchAccountData = async (session: string): Promise<AccountData> => {
  const response = await axios.get(`${BASE_URL}/get-my-accounts.json?session=${session}`);
  const TARGET_ACCOUNT_ID = process.env.NEXT_PUBLIC_MFX_ACC_ID;
  
  const targetAccount = response.data.accounts.find(
    (account: any) => account.id.toString() === TARGET_ACCOUNT_ID
  );

  if (!targetAccount) {
    throw new Error('Account not found');
  }

  return {
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
  };
};
export interface OpenTrade {
  symbol: string;
  action: string;
  sizing: { value: number };
  openPrice: number;
  tp: number;
  pips: number;
  swap: number;
  profit: number;
  openTime: string;
}

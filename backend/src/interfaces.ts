export interface GetAccount {
  amounts: Record<string, number>;
  tickers: string[];
}

export type Timeframe = "D" | "W" | "M" | "Y";

export interface IdwEntry {
  asset: string;
  utc_time: number | bigint;
  dw_id: number;
  change: number;
}

export interface IPlusMinus {
  "+": number;
  "-": number;
}

export interface IdwFormatted {
  assets: Record<string, IPlusMinus>;
  start: number;
}

export interface EverydayMarketInfo {
  name: string;
  value: string;
  raisePoint: string;
  raisePercent: string;
}

export interface EverydayStockInfo {
  code: string;
  name: string;
  volumn: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  closePrice: string;
  raisePoint: string;
  raisePercent: string;
  PE: string;
}

export interface EverydayStockInfoItem {
  date: string;
  stockInfo: EverydayStockInfo[];
}

export interface EverydayStockFileModel {
  market: EverydayMarketInfo;
  stock: EverydayStockInfo[];
}

export interface EverydayStockInfoItemInput {
  code: string;
  dayCount?: number;
}

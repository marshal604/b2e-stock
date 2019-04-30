export interface CreditTradeJsonModel {
  market: MarketCreditTradeList;
  stock: StockCreditTradeList;
}

export interface MarketCreditTradeList {
  date: string; // 日期
  financing: MarketCreditTradeItem; // 融資
  selling: MarketCreditTradeItem; // 融券
  finacingCash: MarketCreditTradeItem; // 融資金額(仟元)
}

export interface GetMarketCreditTradeListInput {
  dayCount?: number;
}

export interface MarketCreditTradeItem {
  buy: string; // 買進
  sell: string; // 賣出
  cashRepayment: string; // 現金(券)償還
  yesterdayBalance: string; // 前日餘額
  todayBalance: string; // 今日餘額
}

export interface StockCreditTradeList {
  date: string; // 日期
  list: StockCreditTradeItem[]; // 個股信用交易項目
}

export interface GetStockCreditTradeListInput {
  code: string;
  dayCount?: number;
}

export interface StockCreditTradeItem {
  code: string; // 股票代號
  name: string; // 股票名稱
  financingBuy: string; // 融資買進
  financingSell: string; // 融資賣出
  financingCashRepayment: string; // 融資現金償還
  financingYesterdayBalance: string; // 融資前日餘額
  financingTodayBalance: string; // 融資今日餘額
  financingLimit: string; // 融資限額
  sellingBuy: string; // 融券買進
  sellingSell: string; // 融券賣出
  sellingCashRepayment: string; // 融券現金償還
  sellingYesterdayBalance: string; // 融券前日餘額
  sellingTodayBalance: string; // 融券今日餘額
  sellingLimit: string; // 融券限額
  payment: string; // 資券互抵
  remark: string; // 註記
}

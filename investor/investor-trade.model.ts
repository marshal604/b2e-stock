export interface InvestorTradeJsonModel {
  stock: StockInvestorTradeList;
}

export interface GetStockInvestorTradeListInput {
  dayCount?: number;
}

export interface GetStockInvestorTradeItemInput {
  code: string;
  dayCount?: number;
}

export interface StockInvestorTradeList {
  date: string;
  list: StockInvestorTradeItem[];
}

export interface StockInvestorTradeItem {
  code: string; // 證券代號
  name: string; // 證券名稱
  foreignInvestorBuy: number; // 外陸資買進股數(不含外資自營商)
  foreignInvestorSell: number; // 外陸資賣出股數(不含外資自營商)
  foreignInvestorBuyAndSell: number; // 外陸資買賣超股數(不含外資自營商)
  securtiesInvestorBuy: number; // 投信買進股數
  securtiesInvestorSell: number; // 投信賣出股數
  securtiesInvestorBuyAndSell: number; // 投信買賣超股數
  dealerBuy: number; // 自營商買進股數(自行買賣)
  dealerSell: number; // 自營商賣出股數(自行買賣)
  dealerBuyAndSell: number; // 自營商買賣超股數(自行買賣)
  allInvestorBuyAndSell: number; // 三大法人買賣超股數
}

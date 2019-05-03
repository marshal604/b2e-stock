export interface InvestorStockJsonModel {
  stock: InvestorStockList;
}

export interface GetInvestorStockListInput {
  dayCount?: number;
}

export interface GetInvestorStockItemInput {
  code: string;
  dayCount?: number;
}

export interface InvestorStockList {
  date: string;
  list: InvestorStockItem[];
}

export interface InvestorStockItem {
  code: string; // "證券代號"
  name: string; // "證券名稱"
  commonStockCount: number; // "發行股數"
  investorStockCount: number; // "全體外資及陸資持有股數"
  investorStockPercent: number; // "全體外資及陸資持股比率"
}

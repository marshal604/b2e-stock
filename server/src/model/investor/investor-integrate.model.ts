import { InvestorStockItem } from './investor-stock.model';
import { InvestorTradeItem } from './investor-trade.model';

export interface InvestorIntegrateItem extends InvestorStockItem, InvestorTradeItem {}
export interface InvestorIntegrateList {
  date: string;
  list: InvestorIntegrateItem[];
}
export interface GetInvestorIntegrateListInput {
  code?: string;
  dayCount?: string;
}

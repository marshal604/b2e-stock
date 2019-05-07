import { EverydayStockInfoItemInput } from '@models/stock-info/stock-info.model';
import {
  GetMarketCreditTradeListInput,
  MarketCreditTradeList,
  GetStockCreditTradeListInput,
  StockCreditTradeList
} from '@models/credit-trade/credit-trade.model';
import { stockDailyInfoList } from '@service/stock-info/stock-info';
import {
  getMarketCreditTradeList,
  getStockCreditTradeList
} from '@service/credit-trade/credit-trade';
import {
  GetInvestorIntegrateListInput,
  InvestorIntegrateList
} from '@models/investor/investor-integrate.model';
import {
  getInvestorIntegrateList,
  getInvestorTrade,
  getInvestorStock
} from '@service/investor/investor';
import {
  GetInvestorTradeListInput,
  InvestorTradeList,
  GetInvestorTradeItemInput
} from '@models/investor/investor-trade.model';
import {
  InvestorStockList,
  GetInvestorStockListInput,
  GetInvestorStockItemInput
} from '@models/investor/investor-stock.model';

export const resolvers = {
  Query: {
    sayHello: (_: any, arg: { name: string }) => `Hello ${arg.name}!`,
    everydayStockInfoList: (_: any, arg: { req: EverydayStockInfoItemInput }) => {
      const code = arg.req ? arg.req.code : undefined;
      const dayCount = arg.req ? arg.req.dayCount : undefined;
      return stockDailyInfoList(code, dayCount);
    },
    marketCreditTradeList: (
      _: any,
      arg: { req: GetMarketCreditTradeListInput }
    ): Promise<MarketCreditTradeList[]> => {
      return getMarketCreditTradeList(arg.req);
    },
    stockCreditTradeList: (
      _: any,
      arg: { req: GetStockCreditTradeListInput }
    ): Promise<StockCreditTradeList[]> => {
      return getStockCreditTradeList(arg.req);
    },
    investorTradeList: (
      _: any,
      arg: { req: GetInvestorTradeListInput }
    ): Promise<InvestorTradeList[]> => {
      return getInvestorTrade(arg.req);
    },
    investorTradeListWithCode: (
      _: any,
      arg: { req: GetInvestorTradeItemInput }
    ): Promise<InvestorTradeList[]> => {
      return getInvestorTrade(arg.req);
    },
    investorStockList: (
      _: any,
      arg: { req: GetInvestorStockListInput }
    ): Promise<InvestorStockList[]> => {
      return getInvestorStock(arg.req);
    },
    investorStockListWithCode: (
      _: any,
      arg: { req: GetInvestorStockItemInput }
    ): Promise<InvestorStockList[]> => {
      return getInvestorStock(arg.req);
    },
    investorIntegrateList: (
      _: any,
      arg: { req: GetInvestorIntegrateListInput }
    ): Promise<InvestorIntegrateList[]> => {
      return getInvestorIntegrateList(arg.req);
    }
  }
};

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
    }
  }
};

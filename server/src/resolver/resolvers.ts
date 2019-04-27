import { EverydayStockInfoItemInput } from "@models/stock-info/stock-info.model";
import { stockDailyInfoList } from "@service/stock-info/stock-info";

export const resolvers = {
  Query: {
    sayHello: (_: any, arg: { name: string }) => `Hello ${arg.name}!`,
    EverydayStockInfoList: (
      _: any,
      arg: { req: EverydayStockInfoItemInput }
    ) => {
      const code = arg.req ? arg.req.code : undefined;
      const dayCount = arg.req ? arg.req.dayCount : undefined;
      return stockDailyInfoList(code, dayCount);
    }
  }
};

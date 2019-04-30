import { readFile } from '@utils/io/io';
import { FileModel } from '@utils/io/io.model';
import { formatDate } from '@utils/date/date';

import {
  MarketCreditTradeList,
  GetMarketCreditTradeListInput,
  StockCreditTradeList,
  GetStockCreditTradeListInput,
  StockCreditTradeItem
} from '@models/credit-trade/credit-trade.model';

export function getMarketCreditTradeList(
  req: GetMarketCreditTradeListInput
): Promise<MarketCreditTradeList[]> {
  return new Promise((resolve, _) => {
    const dayCount = req.dayCount || 1;
    let count = 0;
    const today = new Date();
    const fileName = formatDate(today);
    let option: FileModel = {
      path: 'everyday-credit-trade',
      fileName
    };
    let chain = readFile(option);
    const fileDataArr: MarketCreditTradeList[] = [];
    const countLimit = dayCount * 3;
    while (count++ < countLimit) {
      chain = chain
        .then(fileData => {
          const { market } = JSON.parse(fileData);
          const marketCreditTradeList = market;
          fileDataArr.push(marketCreditTradeList);
          if (fileDataArr.length === dayCount) {
            resolve(fileDataArr);
            return;
          }
          today.setDate(today.getDate() - 1);
          option.fileName = formatDate(today);
          return readFile(option);
        })
        .catch(error => {
          today.setDate(today.getDate() - 1);
          option.fileName = formatDate(today);
          return readFile(option);
        });
    }
    chain.catch(() => {});
  });
}

export function getStockCreditTradeList(
  req: GetStockCreditTradeListInput
): Promise<StockCreditTradeList[]> {
  return new Promise((resolve, _) => {
    const code = req.code;
    const dayCount = req.dayCount || 5;
    let count = 0;
    const today = new Date();
    const fileName = formatDate(today);
    let option: FileModel = {
      path: 'everyday-credit-trade',
      fileName
    };
    let chain = readFile(option);
    const fileDataArr: StockCreditTradeList[] = [];
    const countLimit = dayCount * 3;
    while (count++ < countLimit) {
      chain = chain
        .then(fileData => {
          const { stock } = JSON.parse(fileData);
          const stockCreditTradeList: StockCreditTradeList = {
            date: stock.date,
            list: stock.list.filter((item: StockCreditTradeItem) => item.code === code)
          };
          fileDataArr.push(stockCreditTradeList);
          if (fileDataArr.length === dayCount) {
            resolve(fileDataArr);
            return;
          }
          today.setDate(today.getDate() - 1);
          option.fileName = formatDate(today);
          return readFile(option);
        })
        .catch(error => {
          today.setDate(today.getDate() - 1);
          option.fileName = formatDate(today);
          return readFile(option);
        });
    }
    chain.catch(() => {});
  });
}

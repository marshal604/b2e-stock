import { readFile } from '@utils/io/io';
import { FileModel } from '@utils/io/io.model';
import { formatDate } from '@utils/date/date';
import {
  GetInvestorStockItemInput,
  GetInvestorStockListInput,
  InvestorStockItem,
  InvestorStockList
} from '@models/investor/investor-stock.model';
import {
  GetInvestorTradeListInput,
  GetInvestorTradeItemInput,
  InvestorTradeList,
  InvestorTradeItem
} from '@models/investor/investor-trade.model';
import {
  GetInvestorIntegrateListInput,
  InvestorIntegrateList,
  InvestorIntegrateItem
} from '@models/investor/investor-integrate.model';

export function getInvestorStock(
  req: GetInvestorStockItemInput | GetInvestorStockListInput
): Promise<InvestorStockList[]> {
  return new Promise((resolve, _) => {
    const code = Object.keys(req).some(key => key === 'code')
      ? (req as GetInvestorStockItemInput).code
      : null;
    const dayCount = req.dayCount || 5;
    let count = 0;
    const date = new Date();
    const fileName = formatDate(date);
    let option: FileModel = {
      path: 'everyday-investor-stock',
      fileName
    };
    let chain = readFile(option);
    const fileDataArr: InvestorStockList[] = [];
    const countLimit = dayCount * 3;
    while (count++ < countLimit) {
      chain = chain
        .then(fileData => {
          const { stock } = JSON.parse(fileData);
          const stockCreditTradeList: InvestorStockList = {
            date: stock.date,
            list: code
              ? stock.list.filter((item: InvestorStockItem) => item.code === code)
              : stock.list
          };
          fileDataArr.push(stockCreditTradeList);
          if (fileDataArr.length === dayCount) {
            resolve(fileDataArr);
            return;
          }
          date.setDate(date.getDate() - 1);
          option.fileName = formatDate(date);
          return readFile(option);
        })
        .catch(error => {
          date.setDate(date.getDate() - 1);
          option.fileName = formatDate(date);
          return readFile(option);
        });
    }
    chain.catch(() => {});
  });
}

export function getInvestorTrade(
  req: GetInvestorTradeListInput | GetInvestorTradeItemInput
): Promise<InvestorTradeList[]> {
  return new Promise((resolve, _) => {
    const code = Object.keys(req).some(key => key === 'code')
      ? (req as GetInvestorTradeItemInput).code
      : null;
    const dayCount = req.dayCount || 5;
    let count = 0;
    const date = new Date();
    const fileName = formatDate(date);
    let option: FileModel = {
      path: 'everyday-investor-trade',
      fileName
    };
    let chain = readFile(option);
    const fileDataArr: InvestorTradeList[] = [];
    const countLimit = dayCount * 3;
    while (count++ < countLimit) {
      chain = chain
        .then(fileData => {
          const { stock } = JSON.parse(fileData);
          const stockCreditTradeList: InvestorTradeList = {
            date: stock.date,
            list: code
              ? stock.list.filter((item: InvestorTradeItem) => item.code === code)
              : stock.list
          };
          fileDataArr.push(stockCreditTradeList);
          if (fileDataArr.length === dayCount) {
            resolve(fileDataArr);
            return;
          }
          date.setDate(date.getDate() - 1);
          option.fileName = formatDate(date);
          return readFile(option);
        })
        .catch(error => {
          date.setDate(date.getDate() - 1);
          option.fileName = formatDate(date);
          return readFile(option);
        });
    }
    chain.catch(() => {});
  });
}

export function getInvestorIntegrateList(
  req: GetInvestorIntegrateListInput
): Promise<InvestorIntegrateList[]> {
  const code = req.code;
  const dayCount = req.dayCount || 5;
  const getInvestorStockReq = req.code
    ? ({ code, dayCount } as GetInvestorStockItemInput)
    : ({ dayCount } as GetInvestorStockListInput);
  const getInvestorTradeReq = req.code
    ? ({ code, dayCount } as GetInvestorTradeItemInput)
    : ({ dayCount } as GetInvestorTradeListInput);
  return new Promise((resolve, reject) => {
    Promise.all([getInvestorStock(getInvestorStockReq), getInvestorTrade(getInvestorTradeReq)])
      .then(dataArray => {
        const investorStockList: InvestorStockList[] = dataArray[0];
        const investorTradeList: InvestorTradeList[] = dataArray[1];
        const investorIntegrateList: InvestorIntegrateList[] = investorTradeList.map(tradeList => ({
          date: tradeList.date,
          list: tradeList.list.map(tradeListItem => {
            const findInvestorStockList = investorStockList.find(
              stockList => stockList.date === tradeList.date
            );
            if (!findInvestorStockList) {
              return {
                ...tradeListItem,
                commonStockCount: -1,
                investorStockCount: -1,
                investorStockPercent: -1
              } as InvestorIntegrateItem;
            }
            return {
              ...tradeListItem,
              ...findInvestorStockList.list.find(
                stockListItem => stockListItem.code === tradeListItem.code
              )
            } as InvestorIntegrateItem;
          })
        }));
        resolve(investorIntegrateList);
      })
      .catch(err => {
        reject(err);
      });
  });
}

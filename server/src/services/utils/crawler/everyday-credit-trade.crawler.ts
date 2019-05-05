import axios from 'axios';

import { isCurrentDateIsWeekend, formatDate as formatDateFunc } from '@utils/date/date';
import { writeFile, formatNumberSymbol } from '@utils/io/io';
import {
  MarketCreditTradeList,
  StockCreditTradeItem,
  CreditTradeJsonModel,
  StockCreditTradeList
} from '@models/credit-trade/credit-trade.model';
import { BaseCrawler } from './base.crawler';
export class EverydayCreditTradeCrawler extends BaseCrawler {
  constructor(date: Date) {
    super(date);
  }

  protected get path(): string {
    return 'everyday-credit-trade';
  }

  // server restart will execute

  protected async createEveryDayDataJson(date: Date): Promise<void> {
    // is weeek do nothing
    if (isCurrentDateIsWeekend(date)) {
      return;
    }
    const formatDate = formatDateFunc(date);

    // if has file do nothing
    if (await this.hasEveryDayFile(formatDate)) {
      return;
    }
    // download file
    const url = `http://www.twse.com.tw/exchangeReport/MI_MARGN?response=json&date=${formatDate}&selectType=ALL`;
    axios
      .get(url)
      .then((fileData: any) => {
        try {
          const { date, creditList, data } = fileData.data;
          const marketCreditTradeList: MarketCreditTradeList = {
            date: date,
            financing: {
              buy: formatNumberSymbol(creditList[0][1]),
              sell: formatNumberSymbol(creditList[0][2]),
              cashRepayment: formatNumberSymbol(creditList[0][3]),
              yesterdayBalance: formatNumberSymbol(creditList[0][4]),
              todayBalance: formatNumberSymbol(creditList[0][5])
            },
            selling: {
              buy: formatNumberSymbol(creditList[1][1]),
              sell: formatNumberSymbol(creditList[1][2]),
              cashRepayment: formatNumberSymbol(creditList[1][3]),
              yesterdayBalance: formatNumberSymbol(creditList[1][4]),
              todayBalance: formatNumberSymbol(creditList[1][5])
            },
            finacingCash: {
              buy: formatNumberSymbol(creditList[2][1]),
              sell: formatNumberSymbol(creditList[2][2]),
              cashRepayment: formatNumberSymbol(creditList[2][3]),
              yesterdayBalance: formatNumberSymbol(creditList[2][4]),
              todayBalance: formatNumberSymbol(creditList[2][5])
            }
          };
          const filterStockData: StockCreditTradeItem[] = data
            .filter((array: any) => {
              const code = array[0];
              return code.length === 4 && code.indexOf('00') !== 0;
            })
            .map((array: any) => {
              const parseArray: StockCreditTradeItem = {
                code: array[0],
                name: array[1],
                financingBuy: formatNumberSymbol(array[2]),
                financingSell: formatNumberSymbol(array[3]),
                financingCashRepayment: formatNumberSymbol(array[4]),
                financingYesterdayBalance: formatNumberSymbol(array[5]),
                financingTodayBalance: formatNumberSymbol(array[6]),
                financingLimit: formatNumberSymbol(array[7]),
                sellingBuy: formatNumberSymbol(array[8]),
                sellingSell: formatNumberSymbol(array[9]),
                sellingCashRepayment: formatNumberSymbol(array[10]),
                sellingYesterdayBalance: formatNumberSymbol(array[11]),
                sellingTodayBalance: formatNumberSymbol(array[12]),
                sellingLimit: formatNumberSymbol(array[13]),
                payment: formatNumberSymbol(array[14]),
                remark: array[15]
              };
              return parseArray;
            });
          const filterStockDataList: StockCreditTradeList = {
            date: date,
            list: filterStockData
          };
          const list: CreditTradeJsonModel = {
            market: marketCreditTradeList,
            stock: filterStockDataList
          };
          writeFile({
            path: this.path,
            fileName: formatDate,
            data: JSON.stringify(list)
          });
        } catch (err) {
          console.log('load data somthing error');
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }
}

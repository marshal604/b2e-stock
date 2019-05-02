import axios from 'axios';

import { isCurrentDateIsWeekend, formatDate as formatDateFunc } from '@utils/date/date';
import { writeFile, readFileSync, mkdirIfNotExist, formatNumberSymbol } from '@utils/io/io';
import { FileModel } from '@utils/io/io.model';
import {
  MarketCreditTradeList,
  StockCreditTradeItem,
  CreditTradeJsonModel,
  StockCreditTradeList
} from '@models/credit-trade/credit-trade.model';
export class EverydayCreditTradeCrawler {
  private initDate: Date;
  private path = 'everyday-credit-trade';
  constructor(date: Date) {
    this.initDate = date;
  }

  init() {
    const half_day = 43_200_000;
    this.dailyCrawlEveryDayCreditTrade();
    setInterval(() => {
      this.dailyCrawlEveryDayCreditTrade();
    }, half_day);
  }

  private dailyCrawlEveryDayCreditTrade() {
    mkdirIfNotExist(this.path);
    const intervalTime = 15_000;
    // create everyday-credit-trade
    let everyCreditTradeFileDate = new Date(this.initDate);
    let everyCreditTradeFileCount = 0;

    while (everyCreditTradeFileDate.getTime() < new Date().getTime()) {
      // maybe not write file on ervey start;
      if (this.hasRecentlyEveryDayCreditTradeFile() && everyCreditTradeFileCount === 0) {
        everyCreditTradeFileDate = new Date();
        everyCreditTradeFileDate.setDate(everyCreditTradeFileDate.getDate() - 20);
        everyCreditTradeFileCount++;
      }
      // if has file do nothing
      const formatDate = formatDateFunc(everyCreditTradeFileDate);
      if (
        this.hasEveryDayCreditTradeFile(formatDate, false) ||
        isCurrentDateIsWeekend(everyCreditTradeFileDate)
      ) {
        everyCreditTradeFileDate.setDate(everyCreditTradeFileDate.getDate() + 1);
        continue;
      }
      const tempDate = new Date(everyCreditTradeFileDate.getTime());
      setTimeout(() => {
        this.createEveryDayStockDataJson(tempDate);
      }, intervalTime * everyCreditTradeFileCount);
      everyCreditTradeFileCount++;
      everyCreditTradeFileDate.setDate(everyCreditTradeFileDate.getDate() + 1);
    }
  }

  // server restart will execute

  private createEveryDayStockDataJson(date: Date) {
    // is weeek do nothing
    if (isCurrentDateIsWeekend(date)) {
      return;
    }
    const formatDate = formatDateFunc(date);

    // if has file do nothing
    if (this.hasEveryDayCreditTradeFile(formatDate)) {
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
  private hasRecentlyEveryDayCreditTradeFile(): boolean {
    let hasRecentlyFile = false;
    Array.apply(null, Array(5)).map((_: any, index: number) => {
      const date = new Date();
      date.setDate(date.getDate() - 5);
      const formatDate = formatDateFunc(date);
      if (this.hasEveryDayCreditTradeFile(formatDate, false) && isCurrentDateIsWeekend(date)) {
        hasRecentlyFile = true;
      }
    });
    return hasRecentlyFile;
  }

  private hasEveryDayCreditTradeFile(formatDate: string, log = true): boolean {
    const path = this.path;
    try {
      const fileOption: FileModel = {
        path,
        fileName: formatDate
      };
      readFileSync(fileOption);
      return true;
    } catch {
      if (log) {
        console.log(`not have ${this.path}/${formatDate} file, will download it.`);
      }
      return false;
    }
  }
}

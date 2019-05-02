import axios from 'axios';

import { isCurrentDateIsWeekend, formatDate as formatDateFunc } from '@utils/date/date';
import { writeFile, readFileSync, mkdirIfNotExist, formatNumberSymbol } from '@utils/io/io';
import { FileModel } from '@utils/io/io.model';
import {
  InvestorTradeJsonModel,
  StockInvestorTradeList,
  StockInvestorTradeItem
} from '@models/investor-trade/investor-trade.model';

export class EverydayInvestorTradeCrawler {
  private initDate: Date;
  private path = 'everyday-investor-trade';
  constructor(date: Date) {
    this.initDate = date;
  }

  init() {
    const half_day = 43_200_000;
    this.dailyCrawlEveryDayInvestorTrade();
    setInterval(() => {
      this.dailyCrawlEveryDayInvestorTrade();
    }, half_day);
  }

  private dailyCrawlEveryDayInvestorTrade() {
    mkdirIfNotExist(this.path);
    const intervalTime = 15_000;
    // create everyday-credit-trade
    let everyCreditTradeFileDate = new Date(this.initDate);
    let everyCreditTradeFileCount = 0;

    while (everyCreditTradeFileDate.getTime() < new Date().getTime()) {
      // maybe not write file on ervey start;
      if (this.hasRecentlyEveryDayInvestorTradeFile() && everyCreditTradeFileCount === 0) {
        everyCreditTradeFileDate = new Date();
        everyCreditTradeFileDate.setDate(everyCreditTradeFileDate.getDate() - 20);
        everyCreditTradeFileCount++;
      }
      // if has file do nothing
      const formatDate = formatDateFunc(everyCreditTradeFileDate);
      if (
        this.hasEveryDayInvestorTradeFile(formatDate, false) ||
        isCurrentDateIsWeekend(everyCreditTradeFileDate)
      ) {
        everyCreditTradeFileDate.setDate(everyCreditTradeFileDate.getDate() + 1);
        continue;
      }
      const tempDate = new Date(everyCreditTradeFileDate.getTime());
      setTimeout(() => {
        this.createEveryDayInverstorTradeDataJson(tempDate);
      }, intervalTime * everyCreditTradeFileCount);
      everyCreditTradeFileCount++;
      everyCreditTradeFileDate.setDate(everyCreditTradeFileDate.getDate() + 1);
    }
  }

  // server restart will execute

  private createEveryDayInverstorTradeDataJson(date: Date) {
    // is weeek do nothing
    if (isCurrentDateIsWeekend(date)) {
      return;
    }
    const formatDate = formatDateFunc(date);

    // if has file do nothing
    if (this.hasEveryDayInvestorTradeFile(formatDate)) {
      return;
    }
    // download file
    const url = `http://www.twse.com.tw/fund/T86?response=json&date=${formatDate}&selectType=ALL`;
    axios
      .get(url)
      .then((fileData: any) => {
        try {
          const { date, data } = fileData.data;
          const stockInvestorTradeList: StockInvestorTradeList = {
            date: date,
            list: data
              .filter((array: string[]) => {
                const code = array[0];
                return code.length === 4 && code.indexOf('00') !== 0;
              })
              .map(
                (array: string[]) =>
                  ({
                    code: array[0], // 證券代號
                    name: array[1].trim(), // 證券名稱
                    foreignInvestorBuy: +formatNumberSymbol(array[2]), // 外陸資買進股數(不含外資自營商)
                    foreignInvestorSell: +formatNumberSymbol(array[3]), // 外陸資賣出股數(不含外資自營商)
                    foreignInvestorBuyAndSell: +formatNumberSymbol(array[4]), // 外陸資買賣超股數(不含外資自營商)
                    securtiesInvestorBuy: +formatNumberSymbol(array[8]), // 投信買進股數
                    securtiesInvestorSell: +formatNumberSymbol(array[9]), // 投信賣出股數
                    securtiesInvestorBuyAndSell: +formatNumberSymbol(array[10]), // 投信買賣超股數
                    dealerBuy: +formatNumberSymbol(array[12]), // 自營商買進股數(自行買賣)
                    dealerSell: +formatNumberSymbol(array[13]), // 自營商賣出股數(自行買賣)
                    dealerBuyAndSell: +formatNumberSymbol(array[14]), // 自營商買賣超股數(自行買賣)
                    allInvestorBuyAndSell: +formatNumberSymbol(array[18]) // 三大法人買賣超股數
                  } as StockInvestorTradeItem)
              )
          };
          const list: InvestorTradeJsonModel = {
            stock: stockInvestorTradeList
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
  private hasRecentlyEveryDayInvestorTradeFile(): boolean {
    let hasRecentlyFile = false;
    Array.apply(null, Array(5)).map((_: any, index: number) => {
      const date = new Date();
      date.setDate(date.getDate() - 5);
      const formatDate = formatDateFunc(date);
      if (this.hasEveryDayInvestorTradeFile(formatDate, false) && isCurrentDateIsWeekend(date)) {
        hasRecentlyFile = true;
      }
    });
    return hasRecentlyFile;
  }

  private hasEveryDayInvestorTradeFile(formatDate: string, log = true): boolean {
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

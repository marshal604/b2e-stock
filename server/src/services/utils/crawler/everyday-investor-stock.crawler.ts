import axios from 'axios';

import { isCurrentDateIsWeekend, formatDate as formatDateFunc } from '@utils/date/date';
import { writeFile, readFileSync, mkdirIfNotExist, formatNumberSymbol } from '@utils/io/io';
import { FileModel } from '@utils/io/io.model';
import {
  InvestorStockJsonModel,
  InvestorStockList,
  InvestorStockItem
} from '@models/investor/investor-stock.model';

export class EverydayInvestorStockCrawler {
  private initDate: Date;
  private path = 'everyday-investor-stock';
  constructor(date: Date) {
    this.initDate = date;
  }

  init() {
    const half_day = 43_200_000;
    this.dailyCrawlEveryDayInvestorStock();
    setInterval(() => {
      this.dailyCrawlEveryDayInvestorStock();
    }, half_day);
  }

  private dailyCrawlEveryDayInvestorStock() {
    mkdirIfNotExist(this.path);
    const intervalTime = 15_000;
    // create everyday-credit-trade
    let everyCreditTradeFileDate = new Date(this.initDate);
    let everyCreditTradeFileCount = 0;

    while (everyCreditTradeFileDate.getTime() < new Date().getTime()) {
      // maybe not write file on ervey start;
      if (this.hasRecentlyEveryDayInvestorStockFile() && everyCreditTradeFileCount === 0) {
        everyCreditTradeFileDate = new Date();
        everyCreditTradeFileDate.setDate(everyCreditTradeFileDate.getDate() - 20);
        everyCreditTradeFileCount++;
      }
      // if has file do nothing
      const formatDate = formatDateFunc(everyCreditTradeFileDate);
      if (
        this.hasEveryDayInvestorStockFile(formatDate, false) ||
        isCurrentDateIsWeekend(everyCreditTradeFileDate)
      ) {
        everyCreditTradeFileDate.setDate(everyCreditTradeFileDate.getDate() + 1);
        continue;
      }
      const tempDate = new Date(everyCreditTradeFileDate.getTime());
      setTimeout(() => {
        this.createEveryDayInverstorStockDataJson(tempDate);
      }, intervalTime * everyCreditTradeFileCount);
      everyCreditTradeFileCount++;
      everyCreditTradeFileDate.setDate(everyCreditTradeFileDate.getDate() + 1);
    }
  }

  // server restart will execute

  private createEveryDayInverstorStockDataJson(date: Date) {
    // is weeek do nothing
    if (isCurrentDateIsWeekend(date)) {
      return;
    }
    const formatDate = formatDateFunc(date);

    // if has file do nothing
    if (this.hasEveryDayInvestorStockFile(formatDate)) {
      return;
    }
    // download file
    const url = `http://www.twse.com.tw/fund/MI_QFIIS?response=json&date=${formatDate}&selectType=ALL`;
    axios
      .get(url)
      .then((fileData: any) => {
        try {
          const { date, data } = fileData.data;
          const investorStockList: InvestorStockList = {
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
                    commonStockCount: +formatNumberSymbol(array[3]), // "發行股數"
                    investorStockCount: +formatNumberSymbol(array[5]), // "全體外資及陸資持有股數"
                    investorStockPercent: +formatNumberSymbol(array[7]) // "全體外資及陸資持股比率"
                  } as InvestorStockItem)
              )
          };
          const list: InvestorStockJsonModel = {
            stock: investorStockList
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
  private hasRecentlyEveryDayInvestorStockFile(): boolean {
    let hasRecentlyFile = false;
    Array.apply(null, Array(5)).map((_: any, index: number) => {
      const date = new Date();
      date.setDate(date.getDate() - 5);
      const formatDate = formatDateFunc(date);
      if (this.hasEveryDayInvestorStockFile(formatDate, false) && isCurrentDateIsWeekend(date)) {
        hasRecentlyFile = true;
      }
    });
    return hasRecentlyFile;
  }

  private hasEveryDayInvestorStockFile(formatDate: string, log = true): boolean {
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

import axios from 'axios';

import { isCurrentDateIsWeekend, formatDate as formatDateFunc } from '@utils/date/date';
import { writeFile, readFileSync, mkdirIfNotExist } from '@utils/io/io';
import { FileModel } from '@utils/io/io.model';
import {
  EverydayMarketInfo,
  EverydayStockInfo,
  EverydayStockFileModel
} from '@models/stock-info/stock-info.model';
export class EverydayStockInfoCrawler {
  private initDate: Date;
  private path = 'everyday-stock-info';
  constructor(date: Date) {
    this.initDate = date;
  }

  init() {
    const half_day = 43_200_000;
    this.dailyCrawlEveryDayStockInfo();
    setInterval(() => {
      this.dailyCrawlEveryDayStockInfo();
    }, half_day);
  }

  private dailyCrawlEveryDayStockInfo() {
    mkdirIfNotExist(this.path);
    const intervalTime = 5_000;
    // create everyday-stock-info
    let everyStockDate = new Date(this.initDate);
    let everyStockCount = 0;

    while (everyStockDate.getTime() < new Date().getTime()) {
      // maybe not write file on ervey start;
      if (this.hasRecentlyEveryDayStockDataFile() && everyStockCount === 0) {
        everyStockDate = new Date();
        everyStockDate.setDate(everyStockDate.getDate() - 20);
        everyStockCount++;
      }
      // if has file do nothing
      const formatDate = formatDateFunc(everyStockDate);
      if (
        this.hasEveryDayStockDataJson(formatDate, false) ||
        isCurrentDateIsWeekend(everyStockDate)
      ) {
        everyStockDate.setDate(everyStockDate.getDate() + 1);
        continue;
      }
      const tempDate = new Date(everyStockDate.getTime());
      setTimeout(() => {
        this.createEveryDayStockDataJson(tempDate);
      }, intervalTime * everyStockCount);
      everyStockCount++;
      everyStockDate.setDate(everyStockDate.getDate() + 1);
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
    if (this.hasEveryDayStockDataJson(formatDate)) {
      return;
    }
    // download file
    const url = `http://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${formatDate}&type=ALLBUT0999`;
    axios
      .get(url)
      .then((data: any) => {
        try {
          const marketData = data.data.data1;
          const stockData = data.data.data5;
          marketData[1][2] = marketData[1][2].indexOf('-') !== -1 ? '-' : '';
          const filterMarketData: EverydayMarketInfo = {
            name: marketData[1][0],
            value: marketData[1][1],
            raisePoint: `${marketData[1][2]}${marketData[1][3]}`,
            raisePercent: marketData[1][4]
          };
          const filterStockData: EverydayStockInfo[] = stockData
            .filter((arr: any) => {
              const code = arr[0];
              arr[9] = arr[9].indexOf('-') !== -1 ? '-' : '+';
              return code.length === 4 && code.indexOf('00') !== 0;
            })
            .map((arr: any) => {
              const parseArr: EverydayStockInfo = {
                code: arr[0],
                name: arr[1],
                volumn: arr[3].split(',').join(''),
                openPrice: arr[5],
                highPrice: arr[6],
                lowPrice: arr[7],
                closePrice: arr[8],
                raisePoint: `${(Number(arr[5]) - Number(arr[8])).toFixed(2)}`,
                raisePercent: `${(
                  ((Number(arr[5]) - Number(arr[8])) * 100) /
                  Number(arr[5])
                ).toFixed(2)}`,
                PE: arr[15]
              };
              return parseArr;
            });
          const list: EverydayStockFileModel = {
            market: filterMarketData,
            stock: filterStockData
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
  private hasRecentlyEveryDayStockDataFile(): boolean {
    let hasRecentlyFile = false;
    Array.apply(null, Array(5)).map((_: any, index: number) => {
      const date = new Date();
      date.setDate(date.getDate() - 5);
      const formatDate = formatDateFunc(date);
      if (this.hasEveryDayStockDataJson(formatDate, false) && isCurrentDateIsWeekend(date)) {
        hasRecentlyFile = true;
      }
    });
    return hasRecentlyFile;
  }

  private hasEveryDayStockDataJson(formatDate: string, log = true): boolean {
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

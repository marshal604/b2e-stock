import axios from 'axios';

import { isCurrentDateIsWeekend, formatDate as formatDateFunc } from '@utils/date/date';
import { writeFile } from '@utils/io/io';
import {
  EverydayMarketInfo,
  EverydayStockInfo,
  EverydayStockFileModel
} from '@models/stock-info/stock-info.model';
import { BaseCrawler } from './base.crawler';
export class EverydayStockInfoCrawler extends BaseCrawler {
  constructor(date: Date) {
    super(date);
  }

  protected get path(): string {
    return 'everyday-stock-info';
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
}

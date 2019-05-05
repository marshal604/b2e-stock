import axios from 'axios';

import { isCurrentDateIsWeekend, formatDate as formatDateFunc } from '@utils/date/date';
import { writeFile, formatNumberSymbol } from '@utils/io/io';
import {
  InvestorStockJsonModel,
  InvestorStockList,
  InvestorStockItem
} from '@models/investor/investor-stock.model';
import { BaseCrawler } from './base.crawler';

export class EverydayInvestorStockCrawler extends BaseCrawler {
  constructor(date: Date) {
    super(date);
  }

  protected get path(): string {
    return 'everyday-investor-stock';
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
    const url = `http://www.twse.com.tw/fund/MI_QFIIS?response=json&date=${formatDate}&selectType=ALLBUT0999`;
    axios
      .get(url)
      .then((fileData: any) => {
        try {
          const { date, data } = fileData.data;
          if (data.length === 0) {
            return;
          }
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
                    investorStockPercent: +formatNumberSymbol(array[7].toString()) // "全體外資及陸資持股比率"
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
          console.log('load data somthing error', err);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }
}

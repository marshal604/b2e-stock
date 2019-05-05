import axios from 'axios';

import { isCurrentDateIsWeekend, formatDate as formatDateFunc } from '@utils/date/date';
import { writeFile, formatNumberSymbol } from '@utils/io/io';
import {
  InvestorTradeJsonModel,
  StockInvestorTradeList,
  StockInvestorTradeItem
} from '@models/investor/investor-trade.model';
import { BaseCrawler } from './base.crawler';

export class EverydayInvestorTradeCrawler extends BaseCrawler {
  constructor(date: Date) {
    super(date);
  }

  protected get path(): string {
    return 'everyday-investor-trade';
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
    const url = `http://www.twse.com.tw/fund/T86?response=json&date=${formatDate}&selectType=ALLBUT0999`;
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
}

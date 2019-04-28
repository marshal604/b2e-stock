import { EverydayStockInfoCrawler } from './everyday-stock-info.crawler';
import { EverydayCreditTradeCrawler } from './everyday-credit-trade.crawler';

export class Crawler {
  private everydayStockInfoCrawler: EverydayStockInfoCrawler;
  private everydayCreditTradeCrawler: EverydayCreditTradeCrawler;
  constructor(date: Date) {
    this.everydayStockInfoCrawler = new EverydayStockInfoCrawler(date);
    this.everydayCreditTradeCrawler = new EverydayCreditTradeCrawler(date);
  }

  init() {
    this.everydayStockInfoCrawler.init();
    this.everydayCreditTradeCrawler.init();
  }
}

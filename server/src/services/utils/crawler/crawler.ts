import { EverydayStockInfoCrawler } from './everyday-stock-info.crawler';

export class Crawler {
  private everydayStockInfoCrawler: EverydayStockInfoCrawler;
  constructor(date: Date) {
    this.everydayStockInfoCrawler = new EverydayStockInfoCrawler(date);
  }

  init() {
    this.everydayStockInfoCrawler.init();
  }
}

import { EverydayStockInfoCrawler } from './everyday-stock-info.crawler';
import { EverydayCreditTradeCrawler } from './everyday-credit-trade.crawler';
import { EverydayInvestorTradeCrawler } from './everyday-investor-trade.crawler';
import { EverydayInvestorStockCrawler } from './everyday-investor-stock.crawler';

export class Crawler {
  private everydayStockInfoCrawler: EverydayStockInfoCrawler;
  private everydayCreditTradeCrawler: EverydayCreditTradeCrawler;
  private everydayInvestorTradeCrawler: EverydayInvestorTradeCrawler;
  private everydayInvestorStockCrawler: EverydayInvestorStockCrawler;
  constructor(date: Date) {
    this.everydayStockInfoCrawler = new EverydayStockInfoCrawler(date);
    this.everydayCreditTradeCrawler = new EverydayCreditTradeCrawler(date);
    this.everydayInvestorTradeCrawler = new EverydayInvestorTradeCrawler(date);
    this.everydayInvestorStockCrawler = new EverydayInvestorStockCrawler(date);
  }

  init() {
    this.everydayStockInfoCrawler.init();
    this.everydayCreditTradeCrawler.init();
    this.everydayInvestorTradeCrawler.init();
    this.everydayInvestorStockCrawler.init();
  }
}

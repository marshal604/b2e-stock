import { isCurrentDateIsWeekend, formatDate as formatDateFunc } from '@utils/date/date';
import { readFile, mkdirIfNotExist } from '@utils/io/io';
import { FileModel } from '@utils/io/io.model';

export abstract class BaseCrawler {
  constructor(private initDate: Date) {}

  init() {
    const half_day = 43_200_000;
    setTimeout(() => {
      this.dialyCrawlData();
    }, Math.random() * 10 * 1_000);
    setInterval(() => {
      this.dialyCrawlData();
    }, half_day);
  }

  // file path

  protected abstract get path(): string;

  // server restart will execute

  protected abstract async createEveryDayDataJson(date: Date): Promise<void>;

  // daily crawle
  protected async dialyCrawlData() {
    mkdirIfNotExist(this.path);
    const intervalTime = this.getRandomSec();
    // create crawler file
    let fileDate = new Date(this.initDate);
    let fileCount = 0;
    while (fileDate.getTime() < new Date().getTime()) {
      // maybe not write file on every start;
      if ((await this.hasRecentlyEveryDayFile()) && fileCount === 0) {
        fileDate = new Date();
        fileDate.setDate(fileDate.getDate() - 20);
        fileCount++;
      }
      // if has file do nothing
      const formatDate = formatDateFunc(fileDate);
      if ((await this.hasEveryDayFile(formatDate, false)) || isCurrentDateIsWeekend(fileDate)) {
        fileDate.setDate(fileDate.getDate() + 1);
        continue;
      }
      const tempDate = new Date(fileDate.getTime());
      setTimeout(() => {
        this.createEveryDayDataJson(tempDate);
      }, intervalTime * fileCount);
      fileCount++;
      fileDate.setDate(fileDate.getDate() + 1);
    }
  }

  protected async hasRecentlyEveryDayFile(): Promise<boolean> {
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - 5);
      const formatDate = formatDateFunc(date);
      if ((await this.hasEveryDayFile(formatDate, false)) && isCurrentDateIsWeekend(date)) {
        return true;
      }
    }
    return false;
  }

  protected async hasEveryDayFile(formatDate: string, log = true): Promise<boolean> {
    try {
      const fileOption: FileModel = {
        path: this.path,
        fileName: formatDate
      };
      await readFile(fileOption);

      return true;
    } catch {
      if (log) {
        console.log(`not have ${this.path}/${formatDate} file, will download it.`);
      }
      return false;
    }
  }

  private getRandomSec(): number {
    return (+(Math.random() * 10).toFixed() + 5) * 1_000;
  }
}

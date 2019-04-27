import { readFile } from "@utils/io/io";
import { FileModel } from "@utils/io/io.model";
import { formatDate } from "@utils/date/date";
import {
  EverydayStockInfoItem,
  EverydayStockInfo
} from "@models/stock-info/stock-info.model";

export function stockDailyInfoList(
  code?: string,
  dayCount?: number
): Promise<EverydayStockInfoItem[]> {
  return new Promise((resolve, _) => {
    const defaultDate = dayCount || 5;
    let count = 0;
    const today = new Date();
    const fileName = formatDate(today);
    let option: FileModel = {
      path: "everyday-stock-info",
      fileName
    };
    let chain = readFile(option);
    const fileDataArr: EverydayStockInfoItem[] = [];
    const countLimit = defaultDate * 2;
    while (count++ < countLimit) {
      chain = chain
        .then(fileData => {
          const { stock } = JSON.parse(fileData);
          const everydayStockInfoListItem = {
            date: option.fileName,
            stockInfo: code
              ? stock.filter((item: EverydayStockInfo) => item.code === code)
              : stock
          };
          fileDataArr.push(everydayStockInfoListItem);
          if (fileDataArr.length === defaultDate) {
            resolve(fileDataArr);
            return;
          }
          today.setDate(today.getDate() - 1);
          option.fileName = formatDate(today);
          return readFile(option);
        })
        .catch(error => {
          today.setDate(today.getDate() - 1);
          option.fileName = formatDate(today);
          return readFile(option);
        });
    }
    chain.catch(() => {});
  });
}

// return format is 20180101
export const formatDate = (date: Date): string => {
  const splitDate = date.toLocaleDateString("lt").split("-");
  const format = splitDate
    .map((d: string) => (d.length < 2 ? `0${d}` : d))
    .join("");
  return format;
};

//return 107_01_0
export const formatYearWithMonth = (date: Date): string => {
  const splitDate = date.toLocaleDateString("lt").split("-");
  splitDate[0] = (+splitDate[0] - 1911).toString();
  splitDate[2] = "0";
  return splitDate.join("_");
};

export const isCurrentDateIsWeekend = (date: Date): boolean => {
  return date.getDay() === 6 || date.getDay() === 0;
};
